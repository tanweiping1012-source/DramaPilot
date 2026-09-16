import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { GenerationJob, Money } from "../contracts/index.js";
import { GenerationJobSchema } from "../contracts/index.js";

export class JobStore {
  readonly db: DatabaseSync;
  constructor(
    readonly path: string,
    budget: Money,
  ) {
    if (budget.basis !== "mock" || !Number.isSafeInteger(budget.amount_micros))
      throw new Error("Only safe integer mock budgets enabled");
    mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(
      "PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS jobs (operation_id TEXT PRIMARY KEY, semantic_hash TEXT UNIQUE NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY AUTOINCREMENT, operation_id TEXT NOT NULL, event TEXT NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS adaptations (revision INTEGER PRIMARY KEY, data TEXT NOT NULL);",
    );
    this.db
      .prepare("INSERT OR IGNORE INTO config VALUES (1,?)")
      .run(JSON.stringify(budget));
    const saved = this.budget();
    if (
      saved.currency !== budget.currency ||
      saved.amount_micros !== budget.amount_micros ||
      saved.basis !== budget.basis
    )
      throw new Error("Budget differs from persisted host limit");
  }
  close() {
    this.db.close();
  }
  budget(): Money {
    return JSON.parse(
      (
        this.db.prepare("SELECT data FROM config WHERE id=1").get() as {
          data: string;
        }
      ).data,
    );
  }
  get(id: string): GenerationJob | undefined {
    const row = this.db
      .prepare("SELECT data FROM jobs WHERE operation_id=?")
      .get(id) as { data: string } | undefined;
    return row ? GenerationJobSchema.parse(JSON.parse(row.data)) : undefined;
  }
  list(): GenerationJob[] {
    return (
      this.db.prepare("SELECT data FROM jobs ORDER BY rowid").all() as {
        data: string;
      }[]
    ).map((r) => GenerationJobSchema.parse(JSON.parse(r.data)));
  }
  event(id: string, event: string, data: unknown) {
    this.db
      .prepare("INSERT INTO events(operation_id,event,data) VALUES (?,?,?)")
      .run(id, event, JSON.stringify(data));
  }
  exposure(job: GenerationJob): number {
    const known = job.receipts.reduce(
      (s, r) => s + (r.cost.basis === "unknown" ? 0 : r.cost.amount_micros),
      0,
    );
    return job.billing_state === "settled"
      ? known
      : Math.max(job.reserved.amount_micros, known);
  }
  reserve(
    job: GenerationJob,
    semanticHash: string,
  ): { job: GenerationJob; created: boolean } {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const existing = this.get(job.operation_id);
      const same = this.db
        .prepare("SELECT data FROM jobs WHERE semantic_hash=?")
        .get(semanticHash) as { data: string } | undefined;
      if (existing) {
        if (existing.request_hash !== job.request_hash)
          throw new Error("Operation identity reused for different request");
        this.db.exec("COMMIT");
        return { job: existing, created: false };
      }
      if (same) {
        this.db.exec("COMMIT");
        return {
          job: GenerationJobSchema.parse(JSON.parse(same.data)),
          created: false,
        };
      }
      const b = this.budget();
      if (job.reserved.currency !== b.currency || job.reserved.basis !== "mock")
        throw new Error("Budget unit mismatch");
      if (
        this.list().reduce((s, j) => s + this.exposure(j), 0) +
          job.reserved.amount_micros >
        b.amount_micros
      )
        throw new Error("Budget exhausted including unknown reservations");
      this.db
        .prepare("INSERT INTO jobs VALUES (?,?,?)")
        .run(
          job.operation_id,
          semanticHash,
          JSON.stringify(GenerationJobSchema.parse(job)),
        );
      this.event(job.operation_id, "reserved_before_submit", job);
      this.db.exec("COMMIT");
      return { job, created: true };
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  update(
    id: string,
    mutate: (job: GenerationJob) => GenerationJob,
    event: string,
  ): GenerationJob {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const current = this.get(id);
      if (!current) throw new Error("Unknown operation");
      const next = GenerationJobSchema.parse(mutate(current));
      this.db
        .prepare("UPDATE jobs SET data=? WHERE operation_id=?")
        .run(JSON.stringify(next), id);
      this.event(id, event, next);
      this.db.exec("COMMIT");
      return next;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
}

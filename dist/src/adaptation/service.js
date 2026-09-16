import { canonicalHash, validateAdaptation } from "../contracts/validate.js";
export function saveAdaptation(store, input) {
    store.db.exec("BEGIN IMMEDIATE");
    try {
        const p = validateAdaptation(input);
        const rows = store.db
            .prepare("SELECT revision,data FROM adaptations ORDER BY revision DESC LIMIT 1")
            .get();
        if (rows) {
            const old = JSON.parse(rows.data);
            if (p.project.project_id !== old.project.project_id)
                throw new Error("One project per store");
            if (p.revision === old.revision) {
                if (canonicalHash(p) !== canonicalHash(old))
                    throw new Error("Revision is immutable");
                store.db.exec("COMMIT");
                return old;
            }
            if (p.revision !== old.revision + 1)
                throw new Error("Revision must advance once");
            if (canonicalHash(p.story) !== canonicalHash(old.story) &&
                p.project.revision === old.project.revision)
                throw new Error("Source story changed without source revision/re-ingest");
            const check = (a, b, label) => {
                const { revision: ar, ...ac } = a;
                const { revision: br, ...bc } = b;
                if (br < ar)
                    throw new Error(`Decreasing ${label} revision`);
                if (canonicalHash(ac) !== canonicalHash(bc) && br <= ar)
                    throw new Error(`Changed ${label} must advance revision`);
            };
            for (const c of p.characters) {
                const prev = old.characters.find((x) => x.character_id === c.character_id);
                if (prev)
                    check(prev, c, "character");
            }
            for (const l of p.lines) {
                const prev = old.lines.find((x) => x.line_id === l.line_id);
                if (prev)
                    check(prev, l, "line");
            }
            check(old.locale, p.locale, "locale");
            check(old.project, p.project, "source");
            for (const plan of p.plans) {
                const prev = old.plans.find((s) => s.shot_id === plan.shot_id);
                if (prev)
                    check(prev, plan, "shot");
            }
            if (canonicalHash(old.changes.map((c) => ({ ...c, approval: null }))) !==
                canonicalHash(p.changes.map((c) => ({ ...c, approval: null }))) &&
                p.locale.revision <= old.locale.revision)
                throw new Error("Culture changes require locale revision");
        }
        store.db
            .prepare("INSERT INTO adaptations VALUES (?,?)")
            .run(p.revision, JSON.stringify(p));
        store.db.exec("COMMIT");
        return p;
    }
    catch (e) {
        store.db.exec("ROLLBACK");
        throw e;
    }
}
export function readAdaptation(store, revision) {
    const row = (revision === undefined
        ? store.db
            .prepare("SELECT data FROM adaptations ORDER BY revision DESC LIMIT 1")
            .get()
        : store.db
            .prepare("SELECT data FROM adaptations WHERE revision=?")
            .get(revision));
    if (!row)
        throw new Error("Unknown adaptation");
    return validateAdaptation(JSON.parse(row.data));
}
/** Concrete dependencies drive invalidation; adaptation revision is retained as provenance.
 * The caller retains all old artifacts, and must rebuild aggregate timeline/QA each revision.
 */
export function invalidatedArtifacts(artifacts, change, audioMode) {
    return artifacts
        .filter((a) => {
        if (["episode", "mix", "report"].includes(a.kind))
            return true;
        if (!a.input_revisions.some((r) => r.kind === change.kind &&
            r.id === change.id &&
            r.revision !== change.revision))
            return false;
        if (change.kind === "line" &&
            a.kind === "video" &&
            audioMode !== "native")
            return false;
        return true;
    })
        .map((a) => a.artifact_id);
}

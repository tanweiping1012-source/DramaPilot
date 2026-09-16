import { readFile, realpath } from "node:fs/promises";
import { relative, isAbsolute } from "node:path";
import { createHash } from "node:crypto";
export async function inspectLocalSource(
  path: string,
  root: string,
  signal: AbortSignal,
) {
  const [file, base] = await Promise.all([realpath(path), realpath(root)]);
  const rel = relative(base, file);
  if (rel.startsWith("..") || isAbsolute(rel))
    throw new Error("Input outside configured workspace");
  const bytes = await readFile(file, { signal });
  return {
    path: file,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    ingest_mode: "assisted",
    recognition: "unverified",
    notice:
      "File identity only; no automatic shot/dialogue/character recognition",
  };
}

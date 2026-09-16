export declare function inspectLocalSource(path: string, root: string, signal: AbortSignal): Promise<{
    path: string;
    sha256: string;
    bytes: number;
    ingest_mode: string;
    recognition: string;
    notice: string;
}>;

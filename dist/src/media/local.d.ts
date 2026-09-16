export type MediaTools = {
    ffmpeg: string;
    ffprobe: string;
};
export declare const defaultTools: MediaTools;
export declare function runMedia(executable: string, args: string[], signal?: AbortSignal): Promise<{
    stdout: string;
    stderr: string;
}>;
export declare function mediaHash(path: string, signal?: AbortSignal): Promise<string>;
export declare function probe(path: string, tools?: MediaTools, signal?: AbortSignal): Promise<any>;
/** Concatenate only already-normalized fixture clips. Explicit maps prevent accidental source-audio mixing. */
export declare function concatenateFixture(paths: string[], output: string, tools?: MediaTools, signal?: AbortSignal): Promise<any>;
/** Replace the video track's audio with explicitly selected target/test stems; never mix original audio implicitly. */
export declare function mixAudioStems(input: {
    video: string;
    dialogue: string;
    background: string;
    output: string;
    frames: number;
    fps: number;
    backgroundGain: number;
}, tools?: MediaTools, signal?: AbortSignal): Promise<any>;

/** Local media utilities; shared episode schemas remain owned by A. End frames are exclusive. */
export type Rate = {
    numerator: number;
    denominator: number;
};
export declare function frameMs(frame: number, rate: Rate): number;
export declare function resolveFrames(clips: {
    shotId: string;
    frames: number;
}[]): {
    shotId: string;
    startFrame: number;
    endFrame: number;
}[];
export declare function renderSrt(timeline: ReturnType<typeof resolveFrames>, cues: {
    shotId: string;
    startFrame: number;
    endFrame: number;
    text: string;
}[], rate: Rate): string;
/** Convert measured target duration/cue position to frames; caller chooses containment policy. */
export declare function msToFrame(milliseconds: number, rate: Rate, rounding: 'floor' | 'ceil' | 'nearest'): number;

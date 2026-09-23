/** Offsets use the original UTF-16 string, including any BOM and CRLF bytes decoded to characters. */
export type SrtCue = {
    index: number;
    start_ms: number;
    end_ms: number;
    text: string;
    start_char: number;
    end_char_exclusive: number;
    speaker: null;
};
export type ParsedSrt = {
    cues: SrtCue[];
    overlaps: {
        first: number;
        second: number;
    }[];
    offset_unit: "utf16_code_units";
};
export declare function parseSrt(text: string, videoDurationMs: number): ParsedSrt;

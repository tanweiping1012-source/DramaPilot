import { type AdaptationPackage, type GenerationRequest } from "../contracts/index.js";
export declare function buildRequest(p: AdaptationPackage, operation: string, shotId: string, task?: GenerationRequest["task"]): GenerationRequest;

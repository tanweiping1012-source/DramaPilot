import type { AdaptationPackage, GenerationJob, ReviewReport } from "../contracts/index.js";
export declare function reviewReport(jobs: GenerationJob[]): ReviewReport;
export declare function exportReview(path: string, p: AdaptationPackage, jobs: GenerationJob[]): Promise<ReviewReport>;

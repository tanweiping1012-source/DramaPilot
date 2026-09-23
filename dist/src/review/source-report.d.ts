import type { SourceAssetPackage } from '../contracts/workflow-draft.js';
import type { AssistedIngestReceipt } from '../ingest/assisted.js';
/** Source-only review: every assertion remains attached to its evidence and uncertainty. */
export declare function renderSourceReport(p: SourceAssetPackage, receipt: AssistedIngestReceipt, texts: Map<string, string>): string;

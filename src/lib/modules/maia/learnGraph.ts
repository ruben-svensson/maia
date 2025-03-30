import type { LearnLine, LearnLineId } from "./learnLine";

export type LearnGraph = {
    // [string]LearnLine
    learnLines: Record<LearnLineId, LearnLine>;
    allTags: string[]; // All unique tags from all learn lines
} 
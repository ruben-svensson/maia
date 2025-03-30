import type { LearnLine, LearnLineId } from '$lib/modules/maia/learnLine';
import type { LearnGraph } from '$lib/modules/maia/learnGraph';
import { writable, derived } from 'svelte/store';
import { allLearnLines } from '$lib/data/learnLines';
import { i18n } from '$lib/stores/i18nStore.svelte';

// Initialize the learn graph from the learn lines
function createLearnGraph(learnLines: LearnLine[]): LearnGraph {
    const learnLinesRecord: Record<LearnLineId, LearnLine> = {};

    let allTags: string[] = [];
    
    learnLines.forEach(line => {
        learnLinesRecord[line.id] = line;
        if (line.tags) {
            allTags = [...new Set([...allTags, ...line.tags])]; // Merge tags and remove duplicates
        }
    });
    
    return {
        learnLines: learnLinesRecord,
        allTags: allTags // Unique tags from all learn lines
    };
}

// Create writable stores
export const learnLines = writable<LearnLine[]>(allLearnLines);
export const learnGraph = derived(learnLines, $lines => createLearnGraph($lines));

// Helper functions
export function getLearnLine(id: LearnLineId) {
    return derived(learnGraph, $graph => $graph.learnLines[id]);
}

export function addLearnLine(newLine: LearnLine) {
    learnLines.update(lines => [...lines, newLine]);
}

export function updateLearnLine(updatedLine: LearnLine) {
    learnLines.update(lines => 
        lines.map(line => line.id === updatedLine.id ? updatedLine : line)
    );
}

export function deleteLearnLine(id: LearnLineId) {
    learnLines.update(lines => lines.filter(line => line.id !== id));
}

// Get available learn lines (those whose prerequisites are satisfied)
export function getAvailableLearnLines(completedIds: LearnLineId[]) {
    return derived(learnGraph, $graph => {
        return Object.values($graph.learnLines).filter(line => {
            if (!line.prerequisites || line.prerequisites.length === 0) {
                return true;
            }
            return line.prerequisites.every(preId => completedIds.includes(preId));
        });
    });
}

// Register translations for learn lines
export function registerLearnLineTranslations(learnLines: LearnLine[]) {
    // Create a mutable copy we can modify
    const translations = { ...i18n.translations };
    
    learnLines.forEach(line => {
        // First register the default language (en) using base properties
        // Properly handle the nested structure with type safety
        if (!translations.en.learnLines) {
            // Create the property if it doesn't exist yet
            translations.en = {
                ...translations.en,
                learnLines: {} 
            };
        }
        
        // Now we can safely assign to it
        if (typeof translations.en.learnLines === 'object') {
            translations.en.learnLines[line.id] = {
                title: line.title,
                description: line.description || '',
                example: line.example || ''
            };
        }
        
        // Then register other language translations
        if (line.i18n) {
            const lineTranslations = line.i18n();
            
            Object.entries(lineTranslations).forEach(([lang, trans]) => {
                const langKey = lang as keyof typeof translations;
                
                // Skip if language doesn't exist
                if (!translations[langKey]) return;
                
                // Create learnLines object if it doesn't exist
                if (!translations[langKey].learnLines) {
                    translations[langKey] = {
                        ...translations[langKey],
                        learnLines: {}
                    };
                }
                
                // TypeScript now knows this is safe
                if (typeof translations[langKey].learnLines === 'object') {
                    translations[langKey].learnLines[line.id] = trans;
                }
            });
        }
    });
    
    // Update the store with our modified translations
    // This assumes you have a method to update translations in your i18n store
    // You may need to implement this if it doesn't exist
    Object.keys(translations).forEach(lang => {
        const langKey = lang as keyof typeof translations;
        // Only update if there are changes
        if (JSON.stringify(translations[langKey]) !== JSON.stringify(i18n.translations[langKey])) {
            i18n.translations[langKey] = translations[langKey];
        }
    });
}

// Call this when initializing your store
registerLearnLineTranslations(allLearnLines);
// Store for tracking user profile and their progress
// the data is stored in local storage for now, db later
import { browser } from '$app/environment';
import type { LearnLineId } from "$lib/modules/maia/learnLine";
import { learnGraph } from '$lib/modules/maia/learnStore';
import { get } from 'svelte/store';
import {applyFocusedContentConfig } from '$lib/modules/maia/focusedContent.svelte';

export type ProfileLearnLineStatus = {
    learnLineId: LearnLineId;
    velocity: number; // Current momentum (e.g., 0-100)
    efficacy: number; // Long-term mastery/stability (e.g., 0-1000+)
    currentStepIndex: number; // Current step index in the learn line
    currentContentIndex: number; // Current content index in the step
    status: 'notStarted' | 'inProgress' | 'mastered' | 'needsReview';
    lastAccessed: Date | string; // Date will be serialized as string in localStorage
};

export type Preferences = {
    language: string;
    theme: 'light' | 'dark' | 'print';
    accessibility: {
        highContrast: boolean;
        largeText: boolean;
        reduceMotion: boolean;
    }
};

export type UserProfile = {
    id: string; // Client-side generated ID
    name?: string; // Optional user name
    email?: string; // Optional user email
    created: Date | string; // When the profile was created
    lastActive: Date | string; // Last time the user was active
    preferences: Preferences;
    learnLineStatus: Record<LearnLineId, ProfileLearnLineStatus>; // Status for each learn line
    completedLearnLines: LearnLineId[]; // Track completed learn lines
};

// Create default preferences
const defaultPreferences: Preferences = {
    language: 'en',
    theme: 'light',
    accessibility: {
        highContrast: false,
        largeText: false,
        reduceMotion: false
    }
};

// Initialize with empty profile
let userProfile = $state<UserProfile>({
    id: crypto.randomUUID(),
    created: new Date(),
    lastActive: new Date(),
    preferences: defaultPreferences,
    learnLineStatus: {},
    completedLearnLines: []
});

// Load profile from localStorage on initialization
function loadProfile(): void {
    if (!browser) return;
    
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        try {
            const parsed = JSON.parse(savedProfile);
            
            // Convert date strings back to Date objects
            if (parsed.created) parsed.created = new Date(parsed.created);
            if (parsed.lastActive) parsed.lastActive = new Date(parsed.lastActive);
            
            // Convert date strings in learn line statuses
            Object.values(parsed.learnLineStatus || {}).forEach(status => {
                if ((status as ProfileLearnLineStatus).lastAccessed) {
                    (status as ProfileLearnLineStatus).lastAccessed = 
                        new Date((status as ProfileLearnLineStatus).lastAccessed as string);
                }
            });
            
            // Merge with default values for any new fields
            userProfile = {
                ...userProfile,
                ...parsed,
                preferences: { ...defaultPreferences, ...parsed.preferences }
            };
        } catch (e) {
            console.error('Failed to parse user profile from localStorage:', e);
        }
    }
}

// Save profile to localStorage
function saveProfile(): void {
    if (!browser) return;
    
    // Update last active timestamp
    userProfile.lastActive = new Date();
    
    try {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (e) {
        console.error('Failed to save user profile to localStorage:', e);
    }
}

// Update or create learn line status
function updateLearnLineStatus(
    learnLineId: LearnLineId, 
    updates: Partial<ProfileLearnLineStatus>
): void {
    const currentStatus = userProfile.learnLineStatus[learnLineId] || {
        learnLineId,
        velocity: 0,
        efficacy: 0,
        currentStepIndex: 0,
        currentContentIndex: 0,
        status: 'notStarted' as const,
        lastAccessed: new Date()
    };
    
    // Update with new values
    userProfile.learnLineStatus[learnLineId] = {
        ...currentStatus,
        ...updates,
        lastAccessed: new Date()
    };
    
    saveProfile();
}

// Mark learn line as complete
function completeLearnLine(learnLineId: LearnLineId): void {
    // Update learn line status
    updateLearnLineStatus(learnLineId, {
        status: 'mastered',
        velocity: 100,
        efficacy: 1000
    });
    
    // Add to completed list if not already there
    if (!userProfile.completedLearnLines.includes(learnLineId)) {
        userProfile.completedLearnLines = [...userProfile.completedLearnLines, learnLineId];
    }
    
    saveProfile();
}

// Get available learn lines based on user's completed prerequisites
function getAvailableLearnLines(): LearnLineId[] {
    const graph = get(learnGraph);
    
    return Object.values(graph.learnLines)
        .filter(line => {
            // If no prerequisites, it's available
            if (!line.prerequisites || line.prerequisites.length === 0) {
                return true;
            }
            
            // Check if all prerequisites are completed
            return line.prerequisites.every(preId => 
                userProfile.completedLearnLines.includes(preId)
            );
        })
        .map(line => line.id);
}

// Update user preferences
function updatePreferences(newPreferences: Partial<Preferences>): void {
    userProfile.preferences = {
        ...userProfile.preferences,
        ...newPreferences
    };
    
    saveProfile();
}

// Calculate overall progress percentage across all learn lines
function calculateOverallProgress(): number {
    const graph = get(learnGraph);
    const totalLines = Object.keys(graph.learnLines).length;
    
    if (totalLines === 0) return 0;
    
    const completedCount = userProfile.completedLearnLines.length;
    return Math.round((completedCount / totalLines) * 100);
}

// Start a learn line (initialize or resume)
function startLearnLine(learnLineId: LearnLineId): ProfileLearnLineStatus {
    const status = userProfile.learnLineStatus[learnLineId] || {
        learnLineId,
        velocity: 0,
        efficacy: 0,
        currentStepIndex: 0,
        currentContentIndex: 0,
        status: 'notStarted',
        lastAccessed: new Date()
    };
    
    // If not started or needs review, set to in progress
    if (status.status === 'notStarted' || status.status === 'needsReview') {
        status.status = 'inProgress';
    }
    
    updateLearnLineStatus(learnLineId, status);
    return userProfile.learnLineStatus[learnLineId];
}

// Move to next content in current learn line
function advanceContent(learnLineId: LearnLineId): void {
    const graph = get(learnGraph);
    const learnLine = graph.learnLines[learnLineId];
    
    if (!learnLine) return;
    
    const status = userProfile.learnLineStatus[learnLineId] || startLearnLine(learnLineId);
    const currentStep = learnLine.steps[status.currentStepIndex];
    
    if (!currentStep) return;
    
    // Store next indices before updating them
    let nextStepIndex = status.currentStepIndex;
    let nextContentIndex = status.currentContentIndex;
    
    // If there's more content in this step, advance to it
    if (status.currentContentIndex < currentStep.content.length - 1) {
        nextContentIndex = status.currentContentIndex + 1;
    } 
    // Otherwise, try to move to the next step
    else if (status.currentStepIndex < learnLine.steps.length - 1) {
        nextStepIndex = status.currentStepIndex + 1;
        nextContentIndex = 0;
    }
    // If at the end, do nothing special for now
    else {
        // We're at the end of the learn line
        // This would be where you could mark it as complete or review
    }
    
    // Update status with new indices
    updateLearnLineStatus(learnLineId, {
        currentStepIndex: nextStepIndex,
        currentContentIndex: nextContentIndex
    });
    
    // After updating indices, check if the NEW content is visualization and apply it
    const newStep = learnLine.steps[nextStepIndex];
    if (newStep && newStep.content[nextContentIndex]) {
        const newContent = newStep.content[nextContentIndex];
        
        if (newContent.contentType === 'visualization') {
            console.log('Applying visualization config:', newContent.config);
            applyFocusedContentConfig(newContent.config);
        } else {
            // Optional: clear visualization when not on a visualization content
           /* applyFocusedContentConfig({
                active: false,
                leftSide: "",
                rightSide: "",
                xValue: 0
            });*/
        }

        if (!newContent.nextAction){
            // If there is no next action, we can automatically advance to the next content
            // This might be a bit aggressive, but for now, let's do it
            advanceContent(learnLineId);
        }
    }
}

// Get recommended next learn lines based on user progress
function getRecommendedLearnLines(limit = 3): LearnLineId[] {
    const available = getAvailableLearnLines();
    
    // Filter out completed ones
    const incomplete = available.filter(id => !userProfile.completedLearnLines.includes(id));
    
    // Sort by those already in progress first, then by last accessed
    const sorted = incomplete.sort((a, b) => {
        const statusA = userProfile.learnLineStatus[a];
        const statusB = userProfile.learnLineStatus[b];
        
        // In progress comes first
        if (statusA?.status === 'inProgress' && statusB?.status !== 'inProgress') return -1;
        if (statusB?.status === 'inProgress' && statusA?.status !== 'inProgress') return 1;
        
        // Then sort by last accessed (most recent first)
        const dateA = statusA?.lastAccessed ? new Date(statusA.lastAccessed) : new Date(0);
        const dateB = statusB?.lastAccessed ? new Date(statusB.lastAccessed) : new Date(0);
        
        return dateB.getTime() - dateA.getTime();
    });
    
    return sorted.slice(0, limit);
}

export function debugResetAll(): void {
    if (!browser) return;
    
    // Reset the profile to initial state
    userProfile = {
        id: crypto.randomUUID(),
        created: new Date(),
        lastActive: new Date(),
        preferences: defaultPreferences,
        learnLineStatus: {},
        completedLearnLines: []
    };
    
    // Clear localStorage
    localStorage.removeItem('userProfile');
    
    // Save the reset profile
    saveProfile();

    // Reload the page to reflect changes
    window.location.reload();
}

// Initialize on page load
if (browser) {
    loadProfile();
}

// Export the user profile state and functions
export const userProfileStore = {
    get profile() { return userProfile; },
    updateLearnLineStatus,
    completeLearnLine,
    getAvailableLearnLines,
    updatePreferences,
    calculateOverallProgress,
    startLearnLine,
    advanceContent,
    getRecommendedLearnLines,
    saveProfile,
    debugResetAll
};
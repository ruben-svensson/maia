import type { LearnLineId } from "$lib/modules/maia/learnLine";

type AppState = {
  learnGraphMapOpen: boolean; // Whether the learn graph map is open or not
  currentLearnLine: LearnLineId | null; // The currently selected learn line
  // Add any other global state you need
};

// Create a singleton state object with all your global state values
export const appState = $state<AppState>({
  learnGraphMapOpen: false,
  currentLearnLine: null,
  // Add any other global state you need
});

// Helper functions for common operations
export function toggleLearnGraphMap() {
  appState.learnGraphMapOpen = !appState.learnGraphMapOpen;
}

export function setCurrentLearnLine(learnLineId: LearnLineId) {
  appState.currentLearnLine = learnLineId;
  appState.learnGraphMapOpen = false; // Automatically close the map
}
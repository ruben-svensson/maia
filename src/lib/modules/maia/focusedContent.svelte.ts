
// The content displayed on the desk is the focused content
export type FocusedEquationBalanceContent = {
    active: boolean; // Whether the content is active or not
    leftSide: string; // Left hand side of the equation
    rightSide: string; // Right hand side of the equation
    xValue: number; // Value of x in the equation
    xSymbol: string; // Symbol for x in the equation
}

export const focusedEBContent = $state<FocusedEquationBalanceContent>({
    active: false,
    leftSide: "",
    rightSide: "",
    xValue: 0,
    xSymbol: "x" // Default symbol for x, can be any string
});

export function applyFocusedContentConfig(config: FocusedEquationBalanceContent) {
    if (config.leftSide !== undefined) {
        focusedEBContent.leftSide = config.leftSide;
    }
    if (config.rightSide !== undefined) {
        focusedEBContent.rightSide = config.rightSide;
    }
    if (config.xValue !== undefined) {
        focusedEBContent.xValue = config.xValue;
    }
    if (config.active !== undefined) {
        focusedEBContent.active = config.active;
    }
    if (config.xSymbol !== undefined) {
        focusedEBContent.xSymbol = config.xSymbol;
    }
}

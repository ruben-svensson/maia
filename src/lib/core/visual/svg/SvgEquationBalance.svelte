<script lang="ts">
    import { focusedEBContent, type FocusedEquationBalanceContent } from '$lib/modules/maia/focusedContent.svelte';
    import { spring } from 'svelte/motion';
    import * as mathjs from 'mathjs';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    // Get values from focusedContent
    let {
        active,
        leftSide, // Left side of the equation
        rightSide, // Right side of the equation
    } = focusedEBContent;

    let equation = $derived(`${leftSide} = ${rightSide}`);
    let width = 600;
    
    // Create animated values using springs
    let animatedBalance = spring(0, { 
        stiffness: 0.1, 
        damping: 0.4 
    });
    let animatedLeftValue = spring(0);
    let animatedRightValue = spring(0);
    
    // State for visual elements
    let leftSideNode;
    let rightSideNode;
    let leftSideValue = 0;
    let rightSideValue = 0;
    let balanceLineAngle = $state(0);
    let blY1 = $state(0);
    let blY2 = $state(0);
    let beamScale = spring(1);
    
    // Parse and calculate when inputs change
    $effect(() => {
        try {
            // Get the symbol to use or default to 'x'
            const originalSymbol = focusedEBContent.xSymbol || 'x';
            
            // Use a safe variable name for parsing - mathjs doesn't support emojis or some special chars
            const safeVarName = 'VARIABLE';
            
            // Replace all occurrences of the symbol with the safe variable name for parsing
            let leftExpr = focusedEBContent.leftSide;
            let rightExpr = focusedEBContent.rightSide;
            
            // Only perform replacement if it's not a standard variable name
            if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(originalSymbol)) {
                leftExpr = replaceSymbol(leftExpr, originalSymbol, safeVarName);
                rightExpr = replaceSymbol(rightExpr, originalSymbol, safeVarName);
            }
            
            // Parse with the safe variable name
            leftSideNode = mathjs.parse(leftExpr);
            rightSideNode = mathjs.parse(rightExpr);
            
            // Create scope with both the variable names to handle all cases
            const scope = { 
                [safeVarName]: focusedEBContent.xValue,
                [originalSymbol]: focusedEBContent.xValue  // Always include the original symbol too
            };
            
            // Evaluate with the scope containing both variables
            leftSideValue = leftSideNode.evaluate(scope);
            rightSideValue = rightSideNode.evaluate(scope);
            
            // Update the animated values
            animatedLeftValue.set(leftSideValue);
            animatedRightValue.set(rightSideValue);
            
            // Calculate balance and update spring
            const newBalance = leftSideValue - rightSideValue;
            animatedBalance.set(newBalance);
            
            // Trigger beam scale animation
            beamScale.set(0.95);
            setTimeout(() => beamScale.set(1), 50);
            
            console.log("Evaluated values:", {
                leftSide: leftExpr,
                rightSide: rightExpr,
                leftValue: leftSideValue,
                rightValue: rightSideValue
            });
        } catch (error) {
            console.error('Error parsing equation:', error);
            console.error('Equation parts:', {
                leftSide: focusedEBContent.leftSide,
                rightSide: focusedEBContent.rightSide,
                varSymbol: focusedEBContent.xSymbol,
                value: focusedEBContent.xValue
            });
        }
    });
    
    // Helper function to replace all occurrences of a symbol in an expression
    function replaceSymbol(expr: string, symbol: string, replacement: string): string {
        // Escape special characters for regex
        const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedSymbol, 'g');
        return expr.replace(regex, replacement);
    }
    
    // Calculate visual properties based on the animated balance
    $effect(() => {
        const clampedBalance = Math.max(-10, Math.min(10, $animatedBalance)); // Limit tilt range
        balanceLineAngle = Math.atan2(clampedBalance, 10) * 0.5; // Smooth the angle
        
        // Calculate beam endpoints
        blY1 = -Math.sin(balanceLineAngle) * 120;
        blY2 = Math.sin(balanceLineAngle) * 120;
    });

    // Function to format number display
    function formatValue(val) {
        if (typeof val === 'number') {
            return val % 1 === 0 ? val.toString() : val.toFixed(2);
        }
        return val;
    }
</script>

<g class="equation-balance" transform="translate(0, 50)">
    <!-- Containers for left and right sides with animations -->
    <g class="left-side" transform="translate({-width/2}, {blY2})">
        <!-- Scale pan for left side -->
        <path 
            d="M-50,0 L50,0 L40,40 C30,60 -30,60 -40,40 Z" 
            fill="#f5deb3" 
            stroke="black" 
            stroke-width="3"
            transform="translate(0, 20)"
        />
        
        <!-- Left side equation text -->
        <text y="-40" class="equation-text">{focusedEBContent.leftSide}</text>
        
        <!-- Left side value -->
        <text y="50" class="value-text">{formatValue($animatedLeftValue)}</text>
        
        <!-- Chain -->
        <path 
            d="M0,0 C5,-10 0,-20 0,-30" 
            stroke="#888" 
            stroke-width="3" 
            fill="none"
        />
    </g>
    
    <!-- Right side container -->
    <g class="right-side" transform="translate({width/2}, {blY1})">
        <!-- Scale pan for right side -->
        <path 
            d="M-50,0 L50,0 L40,40 C30,60 -30,60 -40,40 Z" 
            fill="#f5deb3" 
            stroke="black" 
            stroke-width="3"
            transform="translate(0, 20)"
        />
        
        <!-- Right side equation text -->
        <text y="-40" class="equation-text">{focusedEBContent.rightSide}</text>
        
        <!-- Right side value -->
        <text y="50" class="value-text">{formatValue($animatedRightValue)}</text>
        
        <!-- Chain -->
        <path 
            d="M0,0 C5,-10 0,-20 0,-30" 
            stroke="#888" 
            stroke-width="3" 
            fill="none"
        />
    </g>
    
    <!-- Balance beam with scale animation -->
    <g transform="scale({$beamScale}, 1)">
        <!-- Balance line -->
        <line 
            x1={-width/2} 
            y1={blY2} 
            x2={width/2} 
            y2={blY1} 
            class="balance-beam" 
            stroke-width="8" 
            stroke-linecap="round"
        />
    </g>
    
    <!-- Balance point -->
    <g class="balance-stand">
        <!-- Center post -->
        <rect x="-10" y="0" width="20" height="120" fill="#654321" rx="5" />
        
        <!-- Base -->
        <rect x="-60" y="120" width="120" height="20" fill="#654321" rx="5" />
        
        <!-- Pivot point -->
        <circle cx="0" cy="0" r="12" fill="#333" stroke="#111" stroke-width="2" />
    </g>
    
    <!-- Equation indicator -->
    {#if Math.abs($animatedBalance) < 0.01}
    <g class="balanced-indicator" transition:fade>
        <text x="0" y="-116" class="balanced-text">Balanserad!</text>
        <text x="0" y="-80" class="equation-text equals-sign">=</text>
    </g>
    {:else}
    <g class="unbalanced-indicator" transition:fade>
        <text x="0" y="-116" class="unbalanced-text">
            {#if $animatedBalance > 0}
                Vänster sida tyngre!
            {:else}
                Höger sida tyngre!
            {/if}
        </text>
        <text x="0" y="-80" class="equation-text equals-sign">≠</text>
    </g>
    {/if}
</g>

<style lang="scss">
    .equation-balance {
        font-family: 'Arial', sans-serif;
        zoom: 1;
        .equation-text {
            fill: var(--color-text-primary, #333);
            font-weight: bold;
            font-size: 28px;
            text-anchor: middle;
        }
        
        .value-text {
            fill: #0066cc;
            font-weight: bold;
            font-size: 24px;
            text-anchor: middle;
        }
        
        .equals-sign {
            font-size: 40px;
        }
        
        .balanced-text {
            font-size: 24px;
            text-anchor: middle;
            font-weight: bold;
            fill: #006600;
        }
        
        .unbalanced-text {
            font-size: 24px;
            text-anchor: middle;
            font-weight: bold;
            fill: #cc0000;
        }
        
        .balance-beam {
            stroke: #654321;
            transition: stroke 0.3s;
            
            &:hover {
                stroke: #8B4513;
            }
        }
    }
    
    @keyframes pulse {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
    }
    
    .balanced-indicator {
        animation: pulse 2s infinite ease-in-out;
    }
</style>
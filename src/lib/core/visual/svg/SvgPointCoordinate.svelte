<script lang="ts">
    import { onMount } from "svelte";
    import type { PointCoordinate } from "../types";

    let {
        x,
        y,
    }: PointCoordinate = $props();

    let offsetX = $state(0);
    let offsetY = $state(0);
    let pointSize = $state(3); // Default value
    let strokeWidth = $state(1); // Default stroke width
    let ellipseElement: SVGEllipseElement;

    onMount(() => {
        // Read CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        
        // Get the point size 
        const computedSize = computedStyle.getPropertyValue('--point-size').trim();
        pointSize = parseFloat(computedSize) || 3;
        
        // Get stroke width if needed
        const computedStrokeWidth = computedStyle.getPropertyValue('--path-stroke-width').trim();
        strokeWidth = parseFloat(computedStrokeWidth) || 1;
    });
</script>

<!-- Add class for styling -->
<ellipse 
    bind:this={ellipseElement}
    class="point" 
    cx={x} 
    cy={y} 
    rx={pointSize} 
    ry={pointSize} 
    stroke-width={strokeWidth} 
    transform={`translate(${offsetX}, ${offsetY})`} 
/>

<style>
    /* Base styles that can be overridden by global CSS */
    .point {
        transition: all var(--animation-speed, 0.3s) ease;
        /* These will be overridden by your global styles */
        stroke: var(--color-lines-primary);
    }
</style>
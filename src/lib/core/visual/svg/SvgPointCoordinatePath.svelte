<script lang="ts">
	import { onMount } from "svelte";
    import type { PointCoordinatePath } from "../types";
    import SvgPointCoordinate from "./SvgPointCoordinate.svelte";

    let {
        points
    }: PointCoordinatePath = $props();

    let strokeWidth = $state(1); // Default stroke width

    onMount(() => {

        const computedStyle = getComputedStyle(document.documentElement);

        const computedStrokeWidth = computedStyle.getPropertyValue('--path-stroke-width').trim();
        strokeWidth = parseFloat(computedStrokeWidth) || 1; // Default value if not set in CSS
    });

    // Generate the path data string using $derived.by instead of $:
    let pathData = $derived.by(() => {
        return points.length > 0 
            ? `M ${points[0].x} ${points[0].y} ` + 
              points.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ')
            : '';
    });
</script>

<!-- Render the connecting path first (behind the points) -->
<path d={pathData} fill="none" stroke-width={strokeWidth} class="path" />

<!-- Render each point -->
{#each points as point}
    <SvgPointCoordinate x={point.x} y={point.y} />
{/each}

<style lang="scss">
</style>
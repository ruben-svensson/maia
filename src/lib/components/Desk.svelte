<script lang="ts">
	import SvgEquationBalance from '$lib/core/visual/svg/SvgEquationBalance.svelte';
	import { focusedEBContent } from '$lib/modules/maia/focusedContent.svelte';
	import { onMount } from 'svelte';

    // Keep viewBox for proper scaling
    let svgWidth = $state(500);
    let svgHeight = $state(500);
    let svgViewBox = $state('0 0 500 500');
    
    let equationBalanceActive = $derived(focusedEBContent.active)

    //let activeContentType:LearnLineContent = $state('none'); // Placeholder for active content

    onMount (() => {
        // Update svgWidth and svgHeight based on the window size and when it resizes
        const updateDimensions = () => {
            svgWidth = window.innerWidth;
            svgHeight = window.innerHeight;
            svgViewBox = `${-svgWidth/2} ${-svgHeight/2} ${svgWidth} ${svgHeight}`; // Update viewBox
        };

        updateDimensions(); // Initial call to set dimensions
        window.addEventListener('resize', updateDimensions); // Update on resize
        return () => {
            window.removeEventListener('resize', updateDimensions); // Cleanup on component destroy
        };
    });
    
</script>

<div class="container" id="desk">
    <!--Add the svg part later for visualization-->
    
    <svg 
        class="themed-svg"
        viewBox={svgViewBox} 
        xmlns="http://www.w3.org/2000/svg"
    >
        {#if equationBalanceActive}
            <SvgEquationBalance />
        {/if}
    </svg>
</div>

<style lang="scss">
    #desk {
        height: 100vh;
        flex: 1;

        svg {
            width: 100%;
            height: 100%;
        }
    }
</style>
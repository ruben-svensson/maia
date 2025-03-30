<script lang="ts">
    import { learnGraph } from '$lib/modules/maia/learnStore';
    import { i18n } from '$lib/stores/i18nStore.svelte';
    import { appState } from '../stores/appStore.svelte';
    import { userProfileStore, type ProfileLearnLineStatus } from '$lib/stores/userStore.svelte';
	import type { LearnLine, LearnLineStep, LearnLineContent } from '$lib/modules/maia/learnLine';
    
    
    // Track the active learn line ID (already done)
    let activeLearnLineId = $derived(appState.currentLearnLine);

    // Get the active LearnLine object based on the ID
    let activeLearnLine: LearnLine | null = $derived(
        activeLearnLineId ? $learnGraph.learnLines[activeLearnLineId] : null
    );

    // Get the user's status for the active LearnLine
    let activeLearnLineStatus: ProfileLearnLineStatus | null = $derived(
        activeLearnLineId ? userProfileStore.profile.learnLineStatus[activeLearnLineId] : null
    );

    // Determine the current step object
    // Note: Ensure userProfileStore.profile.learnLineStatus[id].currentStepIndex is reactive
    let currentStep: LearnLineStep | null = $derived(
        activeLearnLine && activeLearnLineStatus ?
            activeLearnLine.steps[activeLearnLineStatus.currentStepIndex]
            : null
    );

    // Determine the specific content block to display within the current step
    // Note: Ensure userProfileStore.profile.learnLineStatus[id].currentContentIndex is reactive
    let currentContent: LearnLineContent | null = $derived(
        currentStep && activeLearnLineStatus ?
            currentStep.content[activeLearnLineStatus.currentContentIndex]
            : null
    );

    // Get all content blocks for the current step (useful for sequential display logic)
    let allContents: LearnLineContent[] = $derived(
        currentStep ? currentStep.content : []
    );

    let allContentsUpToCurrent: LearnLineContent[] = $derived(
        currentStep && activeLearnLineStatus ?
            currentStep.content.slice(0, activeLearnLineStatus.currentContentIndex + 1)
            : []
    );

    // Handle continue button - advance to next content
    function handleContinue() {
        if (activeLearnLineId) {
            userProfileStore.advanceContent(activeLearnLineId);
            // You could add logic here to update UI based on new content
        }
    }
    
    
</script>

<div class="container" id="conversation">
    <div class="active-learnline">
        {#if activeLearnLine}
            <div>{i18n.t(`learnLines.${activeLearnLine.id}.title`)}</div>
            {#if activeLearnLineStatus}
                <div class="progress-info">
                    <div class="step-indicator">
                        Step {activeLearnLineStatus.currentStepIndex + 1}/{activeLearnLine.steps.length}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" 
                             style="width: {(activeLearnLineStatus.currentStepIndex / activeLearnLine.steps.length) * 100}%">
                        </div>
                    </div>
                </div>
            {/if}
        {:else}
            <p>{i18n.t('learnLines.startPrompt')}</p>
        {/if}
    </div>
    
    <div class="content-area">
        {#if currentContent}
            {#each allContentsUpToCurrent as content}
                {#if content.contentType === 'text'}
                    <div class="content text-content">{content.text}</div>
                {:else if content.contentType === 'image'}
                    <div class="content image-content">
                        <img src={content.url} alt={content.contentType} />
                    </div>
                {/if}

                
            {/each}
            {#if currentContent.nextAction == 'continueButton'}
                <button on:click={handleContinue}>Continue</button>
            {/if}
            <button on:click={handleContinue}>Debug Continue</button>
        {/if}
    </div>
</div>

<style>
    #conversation {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        min-width: 20%;
        max-width: 40%;

        .active-learnline {
            font-size: 1.1rem;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            color: #00000048; /* Fallback color */
        }

        .progress-info {
            margin-bottom: 15px;
        }
        
        .step-indicator {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 5px;
        }
        
        .progress-bar {
            height: 6px;
            background-color: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
            
            .progress-fill {
                height: 100%;
                background-color: #4caf50;
            }
        }

        .content-area {
            flex-grow: 1;
            padding: 15px;
            border-radius: 8px;

            display: flex;
            flex-direction: column;
            gap: 10px;
            .content {
                padding: 10px;
                border-radius: 4px;
                background-color: #ffffff;

                &.text-content {
                    line-height: 1.5;
                }
                
                &.image-content img {
                    max-width: 100%;
                    border-radius: 4px;
                }
            }

            overflow-y: auto;
        }

        .chat {
            flex:1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            overflow-y: auto;

            .message {
                background-color: #e0f7fa; /* Fallback color */
                padding: 20px;
                border-radius: 5px;
                margin: 10px 5px;
                max-width: 80%;
                word-wrap: break-word;

                &.bot {
                    background-color: #e0f7fa; /* Fallback color */
                }

                &.user {
                    background-color: #ffe0b2; /* Fallback color */
                    align-self: flex-end;
                }

                &.system {
                    background-color: #c8e6c9; /* Fallback color */
                    align-self: center;
                    margin: 10px 0;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;

                    button {
                        background-color: transparent;
                        border: none;
                        cursor: pointer;
                        font-size: 1rem;
                        color: #007bff; /* Fallback color */
                    }
                }
            }
        }

        .input-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            width: 100%;

            input {
                flex: 1;
                margin: 10px;
                padding:10px;
                border-radius: 5px;
                border: 1px solid #ccc;
            }

            button {
                padding: 10px 20px;
                margin-right: 10px;
                background-color: #007bff; /* Fallback color */
                color: #fff; /* Fallback color */
                border: none;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: #0056b3; /* Fallback color */
                }
            }
        }
    }
</style>
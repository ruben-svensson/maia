<script lang="ts">
    import { learnGraph } from '$lib/modules/maia/learnStore';
    import type { LearnLine, LearnLineId } from '$lib/modules/maia/learnLine';
    import { appState, setCurrentLearnLine, toggleLearnGraphMap } from '../stores/appStore.svelte';
    import { i18n } from '$lib/stores/i18nStore.svelte';
    import { userProfileStore } from '$lib/stores/userStore.svelte';
	import { derived } from 'svelte/store';
    
    // Get all learn lines as an array for display
    let learnLinesArray = Object.values($learnGraph.learnLines);
    
    // Track which lines are available based on user's progress
    let availableLines = userProfileStore.getAvailableLearnLines();
    
    // Get recommended lines for the user
    let recommendedLines = userProfileStore.getRecommendedLearnLines(3);
    
    // Overall user progress
    let overallProgress = userProfileStore.calculateOverallProgress();

    // New state variables for the preview modal
    let previewLine = $state<LearnLine | null>(null);
    let showPreview = $state(false);
    
    // Modified selectLearnLine function to show preview first
    function selectLearnLine(line: LearnLine) {
        if (line) {
            previewLine = line;
            showPreview = true;
        }
    }
    
    // Function to start learning after preview
    function startLearning() {
        if (previewLine) {
            // Initialize or resume the learn line in user profile
            userProfileStore.startLearnLine(previewLine.id);
            // Update app state
            setCurrentLearnLine(previewLine.id);
            closePreview();
        }
    }
    
    function closePreview() {
        showPreview = false;
        previewLine = null;
    }
    
    // Determine if a line is completed - use user profile instead of app state
    function isCompleted(lineId: LearnLineId): boolean {
        return userProfileStore.profile.completedLearnLines.includes(lineId);
    }
    
    // Get status for a learn line
    function getLearnLineStatus(lineId: LearnLineId) {
        return userProfileStore.profile.learnLineStatus[lineId] || null;
    }
</script>

<div id="lgm">
    <div id="lgm-container">
        <div id="lgm-header">
            <h1>{i18n.t('lgm.title')}</h1>
            <div class="progress-indicator">
                {overallProgress}% {i18n.t('lgm.status.completed')}
            </div>
            <button on:click={userProfileStore.debugResetAll} class="debug-button">
                {i18n.t('lgm.debug.reset')}
            </button>
            <button class="close-button" on:click={toggleLearnGraphMap}>
                {i18n.t('lgm.close')}
            </button>
        </div>
        
        <p>{i18n.t('lgm.description')}</p>
        
        <div class="grid">
            {#if learnLinesArray.length === 0}
                <div class="no-items">{i18n.t('lgm.noItems')}</div>
            {:else}
                {#each learnLinesArray as line}
                    {@const completed = isCompleted(line.id)}
                    {@const available = availableLines.includes(line.id)}
                    {@const status = getLearnLineStatus(line.id)}
                    
                    <div 
                        class="grid-item" 
                        class:completed={completed}
                        class:available={available && !completed}
                        class:locked={!available && !completed}
                        class:in-progress={status?.status === 'inProgress'}
                        on:click={() => selectLearnLine(line)}
                    >
                        <h3>{i18n.t(`learnLines.${line.id}.title`)}</h3>
                        <p>{i18n.t(`learnLines.${line.id}.description`)}</p>
                        {#if line.example}
                            <p><strong>{line.example}</strong></p>
                        {/if}
                        
                        <!-- Show status badges and progress -->
                        {#if completed}
                            <div class="status-icon" title={i18n.t('lgm.status.completed')}>✓</div>
                        {:else if status?.status === 'inProgress'}
                            <div class="progress-bar" title="Progress">
                                <div class="progress-fill" style="width: {(status.currentStepIndex / line.steps.length) * 100}%"></div>
                            </div>
                        {:else if !available}
                            <div class="status-icon" title={i18n.t('lgm.status.locked')}>🔒</div>
                        {/if}
                        
                        {#if line.prerequisites && line.prerequisites.length > 0}
                            <div class="prerequisites">
                                {i18n.t('lgm.prereq')} 
                                {line.prerequisites.map(preId => 
                                    $learnGraph.learnLines[preId]?.title || preId
                                ).join(", ")}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    
    <!-- Add the preview modal -->
    {#if showPreview && previewLine}
        <div class="preview-modal">
            <div class="preview-content">
                <div class="preview-header">
                    <h2>{i18n.t(`learnLines.${previewLine.id}.title`)}</h2>
                    <button class="close-button" on:click={closePreview}>×</button>
                </div>
                
                <div class="preview-body">
                    <!-- Description section -->
                    <div class="preview-section">
                        <h3>Description</h3>
                        <p>{i18n.t(`learnLines.${previewLine.id}.description`)}</p>
                        {#if previewLine.example}
                            <div class="example-box">
                                <h4>Example:</h4>
                                <p>{previewLine.example}</p>
                            </div>
                        {/if}
                    </div>
                    
                    <!-- Learning path information -->
                    <div class="preview-section">
                        <h3>Learning Path</h3>
                        {#if previewLine.prerequisites && previewLine.prerequisites.length > 0}
                            <div class="prerequisites-list">
                                <h4>Prerequisites:</h4>
                                <ul>
                                    {#each previewLine.prerequisites as preId}
                                        {@const preLine = $learnGraph.learnLines[preId]}
                                        <li class:completed={isCompleted(preId)}>
                                            {preLine ? i18n.t(`learnLines.${preLine.id}.title`) : preId}
                                            {#if isCompleted(preId)}<span class="check">✓</span>{/if}
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {:else}
                            <p>No prerequisites required.</p>
                        {/if}
                    </div>
                    
                    <!-- Content outline -->
                    <div class="preview-section">
                        <h3>Content Overview</h3>
                        <div class="steps-list">
                            {#each previewLine.steps as step, index}
                                <div class="step-item">
                                    <span class="step-number">{index + 1}</span>
                                    <span class="step-title">{step.title || `Step ${index + 1}`}</span>
                                    {#if step.assessment}
                                        <span class="assessment-badge">Assessment</span>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                        <div class="steps-stats">
                            <div class="stat">
                                <span class="stat-value">{previewLine.steps.length}</span>
                                <span class="stat-label">Steps</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">{previewLine.steps.filter(s => s.assessment).length}</span>
                                <span class="stat-label">Assessments</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">~{Math.ceil(previewLine.steps.length * 5)}</span>
                                <span class="stat-label">Minutes</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User's learning progress -->
                    {#if status === 'inProgress'}
                    {@const status = getLearnLineStatus(previewLine.id)}
                        <div class="preview-section progress-section">
                            <h3>Your Progress</h3>
                            <div class="progress-details">
                                <div class="progress-bar large">
                                    <div class="progress-fill" 
                                         style="width: {(status.currentStepIndex / previewLine.steps.length) * 100}%">
                                    </div>
                                </div>
                                <p>You're on step {status.currentStepIndex + 1} of {previewLine.steps.length}</p>
                                <p class="last-access">Last studied: {new Date(status.lastAccessed).toLocaleDateString()}</p>
                            </div>
                        </div>
                    {/if}
                </div>
                
                <div class="preview-footer">
                    <button class="secondary-button" on:click={closePreview}>Cancel</button>
                    <button class="primary-button" on:click={startLearning}>
                        {status === 'inProgress' ? 'Continue Learning' : 'Start Learning'}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    #lgm {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        
        #lgm-container {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 800px;
            text-align: center;
            max-height: 80vh;
            overflow-y: auto;
            
            #lgm-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                
                h1 {
                    margin: 0;
                }
                
                .close-button {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 50%;
                    
                    &:hover {
                        background-color: #f0f0f0;
                    }
                }
            }

            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;

                .grid-item {
                    background-color: #f0f0f0;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: left;
                    position: relative;
                    transition: all 0.3s;
                    
                    h3 {
                        margin-top: 0;
                        margin-bottom: 10px;
                    }
                    
                    p {
                        margin-bottom: 15px;
                        font-size: 0.9rem;
                    }
                    
                    .status-icon {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 1.2rem;
                    }
                    
                    .prerequisites {
                        font-size: 0.8rem;
                        color: #666;
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                    
                    &.completed {
                        background-color: #d4edda;
                        border-left: 4px solid #28a745;
                        cursor: pointer;
                        
                        &:hover {
                            background-color: #c3e6cb;
                        }
                    }
                    
                    &.available {
                        border-left: 4px solid #17a2b8;
                        cursor: pointer;
                        
                        &:hover {
                            background-color: #e0e0e0;
                        }
                    }
                    
                    &.locked {
                        background-color: #f8f9fa;
                        color: #adb5bd;
                        cursor: not-allowed;
                    }
                    
                    &.in-progress {
                        border-left: 4px solid #ff9800;
                        background-color: #fff3e0;
                    }
                }
            }
        }
    }

    .no-items {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        color: #666;
        font-style: italic;
    }

    .progress-indicator {
        background-color: #28a745;
        color: white;
        border-radius: 10px;
        padding: 5px 10px;
        font-size: 0.9rem;
    }
    
    .recommendation-items {
        display: flex;
        overflow-x: auto;
        padding: 10px 0;
        gap: 15px;
        margin-bottom: 20px;
        
        .recommendation-item {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            min-width: 200px;
            cursor: pointer;
            border-left: 4px solid #1976d2;
            
            h4 {
                margin: 0 0 10px 0;
            }
            
            .status-badge {
                display: inline-block;
                background-color: #ff9800;
                color: white;
                border-radius: 12px;
                padding: 3px 8px;
                font-size: 0.7rem;
            }
            
            &:hover {
                background-color: #bbdefb;
            }
        }
    }
    
    .progress-bar {
        height: 6px;
        width: 100%;
        background-color: #e0e0e0;
        border-radius: 3px;
        overflow: hidden;
        margin-top: 10px;
        
        .progress-fill {
            height: 100%;
            background-color: #4caf50;
        }
    }
    
    /* Preview modal styles */
    .preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1100; // Higher than the LearnGraphMap
        
        .preview-content {
            background-color: white;
            border-radius: 10px;
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            
            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
                
                h2 {
                    margin: 0;
                    font-size: 1.6rem;
                }
                
                .close-button {
                    font-size: 24px;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
            }
            
            .preview-body {
                padding: 20px;
                flex: 1;
                
                .preview-section {
                    margin-bottom: 25px;
                    
                    h3 {
                        font-size: 1.2rem;
                        margin-top: 0;
                        margin-bottom: 10px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid #eee;
                    }
                    
                    .example-box {
                        background-color: #f8f9fa;
                        border-left: 4px solid #17a2b8;
                        padding: 15px;
                        margin-top: 15px;
                        
                        h4 {
                            margin-top: 0;
                            margin-bottom: 5px;
                            font-size: 1rem;
                        }
                        
                        p {
                            margin: 0;
                            font-family: monospace;
                            font-size: 1.1rem;
                        }
                    }
                    
                    .prerequisites-list {
                        ul {
                            padding-left: 20px;
                            
                            li {
                                margin-bottom: 5px;
                                color: #666;
                                
                                &.completed {
                                    color: #28a745;
                                    
                                    .check {
                                        margin-left: 5px;
                                    }
                                }
                            }
                        }
                    }
                    
                    .steps-list {
                        .step-item {
                            display: flex;
                            align-items: center;
                            padding: 8px 0;
                            border-bottom: 1px solid #f0f0f0;
                            
                            .step-number {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 28px;
                                height: 28px;
                                background-color: #f0f0f0;
                                border-radius: 50%;
                                margin-right: 10px;
                                font-size: 0.9rem;
                                font-weight: 500;
                            }
                            
                            .assessment-badge {
                                margin-left: auto;
                                font-size: 0.8rem;
                                background-color: #6c757d;
                                color: white;
                                padding: 2px 8px;
                                border-radius: 10px;
                            }
                        }
                    }
                    
                    .steps-stats {
                        display: flex;
                        justify-content: space-around;
                        margin-top: 20px;
                        
                        .stat {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            
                            .stat-value {
                                font-size: 1.8rem;
                                font-weight: bold;
                            }
                            
                            .stat-label {
                                font-size: 0.9rem;
                                color: #666;
                            }
                        }
                    }
                }
                
                .progress-section {
                    background-color: #fff3e0;
                    border-radius: 8px;
                    padding: 15px;
                    
                    h3 {
                        color: #e65100;
                        border-bottom-color: #ffcc80;
                    }
                    
                    .progress-bar.large {
                        height: 10px;
                        margin-bottom: 10px;
                    }
                    
                    p {
                        margin: 5px 0;
                    }
                    
                    .last-access {
                        font-size: 0.8rem;
                        color: #666;
                        text-align: right;
                    }
                }
            }
            
            .preview-footer {
                padding: 15px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                
                button {
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    
                    &.secondary-button {
                        background-color: #f8f9fa;
                        border: 1px solid #ddd;
                        color: #6c757d;
                        
                        &:hover {
                            background-color: #e9ecef;
                        }
                    }
                    
                    &.primary-button {
                        background-color: #4CAF50;
                        border: 1px solid #43a047;
                        color: white;
                        
                        &:hover {
                            background-color: #388e3c;
                        }
                    }
                }
            }
        }
    }
    
    /* Add this for the progress bar in the preview */
    .progress-bar.large {
        height: 10px;
    }
</style>
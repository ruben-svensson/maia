<script lang="ts">
    import { userProfileStore } from '$lib/stores/userStore.svelte';
    import { learnGraph } from '$lib/modules/maia/learnStore';
    import { i18n } from '$lib/stores/i18nStore.svelte';
    import { onMount } from 'svelte';
    
    // Get profile data
    $: profile = userProfileStore.profile;
    $: completedCount = profile.completedLearnLines.length;
    $: totalLearnLines = Object.keys($learnGraph.learnLines).length;
    $: overallProgress = userProfileStore.calculateOverallProgress();
    
    // Get in-progress learn lines
    $: inProgressLines = Object.values(profile.learnLineStatus)
        .filter(status => status.status === 'inProgress')
        .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
    
    // Handle theme change
    function changeTheme(theme: 'light' | 'dark' | 'print') {
        userProfileStore.updatePreferences({
            theme: theme
        });
        document.body.classList.toggle('theme-dark', theme === 'dark');
    }
    
    // Handle language change
    function changeLanguage(lang: 'en' | 'sv') {
        i18n.setLanguage(lang);
        userProfileStore.updatePreferences({
            language: lang
        });
    }
    
    // Handle accessibility settings
    function toggleAccessibility(setting: keyof typeof profile.preferences.accessibility) {
        const newSettings = {...profile.preferences.accessibility};
        newSettings[setting] = !newSettings[setting];
        
        userProfileStore.updatePreferences({
            accessibility: newSettings
        });
    }
</script>

<div class="profile-container">
    <h1>Your Profile</h1>
    
    <div class="profile-section">
        <h2>Learning Progress</h2>
        <div class="progress-summary">
            <div class="progress-circle large" style="--progress: {overallProgress}">
                <span class="progress-text">{overallProgress}%</span>
            </div>
            <div class="progress-stats">
                <div class="stat-item">
                    <span class="label">Completed:</span>
                    <span class="value">{completedCount} learn lines</span>
                </div>
                <div class="stat-item">
                    <span class="label">Total Available:</span>
                    <span class="value">{totalLearnLines} learn lines</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="profile-section">
        <h2>Current Learning</h2>
        {#if inProgressLines.length > 0}
            <div class="in-progress-items">
                {#each inProgressLines as line}
                    {@const learnLine = $learnGraph.learnLines[line.learnLineId]}
                    {#if learnLine}
                        <div class="learn-line-card">
                            <h3>{i18n.t(`learnLines.${learnLine.id}.title`)}</h3>
                            <div class="progress-details">
                                <div class="progress-bar">
                                    <div class="progress-fill" 
                                         style="width: {(line.currentStepIndex / learnLine.steps.length) * 100}%">
                                    </div>
                                </div>
                                <span class="step-info">
                                    Step {line.currentStepIndex + 1} of {learnLine.steps.length}
                                </span>
                            </div>
                            <div class="stats">
                                <div class="stat">Velocity: {line.velocity}%</div>
                                <div class="stat">Mastery: {Math.round(line.efficacy / 10)}%</div>
                                <div class="last-accessed">
                                    Last studied: {new Date(line.lastAccessed).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {:else}
            <p>No active learning in progress. Start a new learning line!</p>
        {/if}
    </div>
    
    <div class="profile-section">
        <h2>Preferences</h2>
        
        <div class="preference-group">
            <h3>Theme</h3>
            <div class="theme-options">
                <button 
                    class:active={profile.preferences.theme === 'light'}
                    on:click={() => changeTheme('light')}
                >
                    Light
                </button>
                <button 
                    class:active={profile.preferences.theme === 'dark'}
                    on:click={() => changeTheme('dark')}
                >
                    Dark
                </button>
                <button 
                    class:active={profile.preferences.theme === 'print'}
                    on:click={() => changeTheme('print')}
                >
                    Print
                </button>
            </div>
        </div>
        
        <div class="preference-group">
            <h3>Language</h3>
            <div class="language-options">
                <button 
                    class:active={profile.preferences.language === 'en'}
                    on:click={() => changeLanguage('en')}
                >
                    English
                </button>
                <button 
                    class:active={profile.preferences.language === 'sv'}
                    on:click={() => changeLanguage('sv')}
                >
                    Svenska
                </button>
            </div>
        </div>
        
        <div class="preference-group">
            <h3>Accessibility</h3>
            <div class="accessibility-options">
                <label>
                    <input 
                        type="checkbox" 
                        checked={profile.preferences.accessibility.highContrast}
                        on:change={() => toggleAccessibility('highContrast')}
                    />
                    High Contrast
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={profile.preferences.accessibility.largeText}
                        on:change={() => toggleAccessibility('largeText')}
                    />
                    Large Text
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={profile.preferences.accessibility.reduceMotion}
                        on:change={() => toggleAccessibility('reduceMotion')}
                    />
                    Reduce Motion
                </label>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    
    .profile-section {
        margin-bottom: 40px;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .progress-summary {
        display: flex;
        align-items: center;
        
        .progress-circle.large {
            width: 120px;
            height: 120px;
            margin-right: 30px;
            
            .progress-text {
                font-size: 1.8rem;
            }
        }
    }
    
    .progress-stats {
        flex: 1;
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }
    }
    
    .learn-line-card {
        padding: 15px;
        margin-bottom: 15px;
        border-left: 4px solid #ff9800;
        background-color: #fff3e0;
        border-radius: 5px;
        
        h3 {
            margin-top: 0;
        }
        
        .progress-details {
            margin: 15px 0;
        }
        
        .stats {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            
            .stat {
                background-color: #e3f2fd;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9rem;
            }
            
            .last-accessed {
                width: 100%;
                font-size: 0.8rem;
                color: #666;
                text-align: right;
            }
        }
    }
    
    .preference-group {
        margin-bottom: 20px;
        
        h3 {
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        }
        
        .theme-options, .language-options {
            display: flex;
            gap: 10px;
            
            button {
                padding: 8px 15px;
                border: 1px solid #ddd;
                background: #f5f5f5;
                border-radius: 5px;
                cursor: pointer;
                
                &.active {
                    background-color: #4caf50;
                    color: white;
                    border-color: #4caf50;
                }
            }
        }
        
        .accessibility-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            
            label {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                
                input {
                    width: 18px;
                    height: 18px;
                }
            }
        }
    }
    
    .progress-bar {
        height: 8px;
        width: 100%;
        background-color: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 5px;
        
        .progress-fill {
            height: 100%;
            background-color: #4caf50;
        }
    }
    
    .step-info {
        font-size: 0.9rem;
        color: #666;
    }
</style>
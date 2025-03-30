<script lang="ts">
    import './style.scss';
    import Conversation from '$lib/components/Conversation.svelte';
    import Desk from '$lib/components/Desk.svelte';
    import LearnGraphMap from '$lib/components/LearnGraphMap.svelte';
    import { toggleLearnGraphMap, appState } from '$lib/stores/appStore.svelte';
    import { i18n, type Language } from '$lib/stores/i18nStore.svelte';
    import { userProfileStore } from '$lib/stores/userStore.svelte';
    import { onMount } from 'svelte';
    
    // Sync i18n with user preferences
    onMount(() => {
        // Set language from user preferences
        if (userProfileStore.profile.preferences.language) {
            i18n.setLanguage(userProfileStore.profile.preferences.language as any);
        }
        
        // Apply theme from user preferences
        document.body.classList.toggle('theme-dark', 
            userProfileStore.profile.preferences.theme === 'dark');
    });
</script>

<div id="header">
    <div class="navbar">
        <div class="title">Maia</div>
        <div class="nav-links">
            <a href="/profile" class="nav-link">Profile</a>
        </div>
    </div>
</div>

<button id="lgm" class="lgm-button" on:click={() => toggleLearnGraphMap()}>
    <span class="lgm-text">{i18n.t('app.lgm.open')}</span>
    <span class="lgm-icon">📊</span>
</button>

<div id="page" class="container">
    <Desk />
    <Conversation />
</div>

{#if appState.learnGraphMapOpen}
    <LearnGraphMap />
{/if}

<style lang="scss">
    #header {
        position: fixed;
        top: 20px;
        left: 20px;

        display: flex;
        gap:40px;

        .navbar {
            display: flex;
            flex-direction: column;

            .title {
                font-size: 2rem;
                color: #cccccc;
            }

            .nav-links {
                display: flex;
                gap: 20px;

                .nav-link {
                    text-decoration: none;
                    color: #4CAF50;
                    font-weight: bold;
                }

                .language-selector {
                    margin-top: 10px;
                    button {
                        margin-right: 10px;
                        padding: 5px 10px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .user-progress {
        position: fixed;
        top: 20px;
        right: 20px;
        
        .progress-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: conic-gradient(
                #4CAF50 calc(var(--progress) * 1%),
                #e0e0e0 0
            );
            display: flex;
            align-items: center;
            justify-content: center;
            
            &::before {
                content: '';
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: white;
            }
            
            .progress-text {
                position: relative;
                font-weight: bold;
                font-size: 1rem;
            }
        }
    }

    #lgm {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
    }

    #page {
        display: flex;
        flex-direction: row;
        height: 100vh;
        background-color: var(--color-background);
    }
</style>
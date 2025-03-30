<!-- Add recommended section -->
        <!--{#if recommendedLines.length > 0}
            <div class="recommendations">
                <h2>Recommended for you</h2>
                <div class="recommendation-items">
                    {#each recommendedLines as recId}
                        {@const line = $learnGraph.learnLines[recId]}
                        {#if line}
                            <div 
                                class="recommendation-item"
                                on:click={() => selectLearnLine(line)}
                            >
                                <h4>{i18n.t(`learnLines.${line.id}.title`)}</h4>
                                {#if getLearnLineStatus(line.id)?.status === 'inProgress'}
                                    <div class="status-badge">In progress</div>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/if}-->
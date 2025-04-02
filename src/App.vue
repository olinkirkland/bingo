<template>
    <div class="app">
        <h1>DB Bingo</h1>
        <Button @click="generateSpaces" primary>
            <i class="fas fa-random"></i>
            <span> Reset Bingo Spaces </span></Button
        >
        <div class="scrollable-container">
            <ul class="spaces">
                <li
                    v-for="(space, index) in spaces"
                    :key="index"
                    class="space"
                    :class="{ 'crossed-out': getEntryByIndex(index) }"
                >
                    <span>{{ space }}</span>
                    <i class="fas fa-times"></i>
                    <span class="time-crossed-out">
                        {{ formatEntryDate(getEntryByIndex(index)?.date) }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import stoerungen from '@/assets/stoerungen.json';
import { ref } from 'vue';
import Button from './components/ui/Button.vue';

const spaces = ref<String[]>([]);

const data = ref<{
    entries: {
        index: number; // Index of the space
        date: number; // Unix timestamp
    }[];
}>({
    entries: []
});

function generateSpaces() {
    const randomizedStoerungen = stoerungen.sort(() => Math.random() - 0.5);
    spaces.value = randomizedStoerungen.slice(0, 24);

    // Insert the free space
    const centerIndex = Math.floor(spaces.value.length / 2);
    spaces.value.splice(centerIndex, 0, 'DB gewählt (Free Space)');

    // Add the free space to the data
    data.value.entries.push({
        index: centerIndex,
        date: new Date().getTime()
    });
}

function formatEntryDate(date: number | undefined) {
    // Format the date to a readable format
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    return new Date(date).toLocaleString('de-DE', options);
}

function getEntryByIndex(index: number) {
    // Get the entry for the given index, if it's crossed out
    // Return null if not crossed out

    const entry = data.value.entries.find((entry) => entry.index === index);
    if (!entry) return null;

    return entry;
}
</script>

<style lang="scss">
@use '@/assets/scss/variables.scss';
@use '@/assets/scss/reset.scss';
@use '@/assets/scss/styles.scss';

.app {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    gap: 0.8rem;
}

.scrollable-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    padding: 2rem;
    border-radius: 1rem;
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

ul.spaces {
    width: 100%;
    min-width: 48rem;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: repeat(5, minmax(0, 1fr));
    gap: 1px;
    background-color: var(--color-on-surface);
    border: 1px solid var(--color-on-surface);

    > li {
        position: relative;
        aspect-ratio: 1;
        background-color: var(--color-surface);
        padding: 0.8rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        > span {
            text-align: center;
            font-size: 1.2rem;
            line-height: 1.4rem;
        }

        > i {
            display: none;
            position: absolute;
            font-size: 6.4rem;
            color: var(--color-surface);
        }

        > .time-crossed-out {
            display: none;
            position: absolute;
            width: 100%;
            bottom: 0.4rem;
            font-size: 1.2rem;
            color: var(--color-surface);
            text-transform: uppercase;
        }

        &.crossed-out {
            background-color: var(--color-primary);
            > span {
                color: var(--color-surface);
            }
            > i {
                display: block;
                opacity: 0.4;
            }
            > .time-crossed-out {
                display: block;
            }
        }
    }
}
</style>

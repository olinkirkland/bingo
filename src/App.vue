<template>
    <div class="app">
        <h1>DB Bingo</h1>
        <Button @click="generateSpaces" primary>
            <i class="fa-solid fa-dice"></i>
            <span> Generate Bingo Spaces </span></Button
        >
        <div class="scrollable-container">
            <ul class="spaces">
                <li v-for="(space, index) in spaces" :key="index" class="space">
                    <span>{{ space }}</span>
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

function generateSpaces() {
    const randomizedStoerungen = stoerungen.sort(() => Math.random() - 0.5);
    spaces.value = randomizedStoerungen.slice(0, 24);

    // Insert the free space
    const centerIndex = Math.floor(spaces.value.length / 2);
    spaces.value.splice(centerIndex, 0, 'DB gewählt (Free Space)');
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
    padding: 0.8rem;
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
    }
}
</style>

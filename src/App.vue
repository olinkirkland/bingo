<template>
    <div class="app">
        <h1>DB Bingo</h1>
        <Button @click="generateSpaces" primary>
            <span> Generate Bingo Spaces </span></Button
        >
        <div>
            <ul class="spaces">
                <li v-for="(space, index) in spaces" :key="index" class="space">
                    {{ space }}
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
    // Create an array of n numbers equal to stoerungen.length
    const n = stoerungen.length;
    const numbers = Array.from({ length: n }, (_, i) => i + 1);
    // Shuffle the numbers array
    numbers.sort(() => Math.random() - 0.5);
    // Fill spaces with stoerungen equivalent to the shuffled numbers
    for (let i = 0; i < n; i++) spaces.value[i] = stoerungen[numbers[i] - 1];

    // Add the free space
    const centerIndex = Math.floor(spaces.value.length / 2);
    spaces.value[centerIndex] = 'DB gewählt (FREE SPACE)';
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

ul.spaces {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    list-style: none;
    padding: 0;
    border: 1px solid red;

    > li {
        // Square
        width: 100%;
        height: 0;
    }
}
</style>

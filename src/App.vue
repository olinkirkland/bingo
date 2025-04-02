<template>
    <div class="app">
        <h1>DB Bingo</h1>
        <p>
            Klicke auf die Felder, um sie durchzustreichen. Klicke erneut auf
            ein Feld, um es wieder zu entfernen.
        </p>

        <div class="scrollable-container">
            <ul class="spaces">
                <li
                    v-for="(space, index) in spaces"
                    :key="index"
                    class="space"
                    :class="{ 'crossed-out': getEntryByIndex(index) }"
                    @click="toggleEntryByIndex(index)"
                >
                    <span>{{ space }}</span>
                    <i class="fas fa-times"></i>
                    <span class="time-crossed-out">
                        {{ formatEntryDate(getEntryByIndex(index)?.date) }}
                    </span>
                </li>
            </ul>
        </div>

        <Button @click="askAndResetSpaces" primary>
            <i class="fas fa-random"></i>
            <span>Felder mischen</span></Button
        >
    </div>
    <the-modal-container />
</template>

<script setup lang="ts">
import stoerungen from '@/assets/stoerungen.json';
import { ref, watch } from 'vue';
import TheModalContainer from './components/modals/TheModalContainer.vue';
import Button from './components/ui/Button.vue';
import ModalController from './controllers/modal-controller';
import ConfirmModal from './components/modals/templates/ConfirmModal.vue';

const spaces = ref<String[]>([]);

const data = ref<{
    entries: {
        index: number; // Index of the space
        date: number; // Unix timestamp
    }[];
}>({
    entries: []
});

// Load spaces from localstorage
const storedSpaces = localStorage.getItem('bingo-spaces');
if (storedSpaces) {
    spaces.value = JSON.parse(storedSpaces);
} else {
    // If no spaces are found, reset the spaces
    resetSpaces();
}

// Load entries from localstorage
const storedEntries = localStorage.getItem('bingo-entries');
if (storedEntries) {
    data.value.entries = JSON.parse(storedEntries);
} else {
    // If no entries are found, initialize with an empty array
    data.value.entries = [];
}

// Watch entries and save to localstorage
watch(
    () => data.value.entries,
    (newEntries) => {
        localStorage.setItem('bingo-entries', JSON.stringify(newEntries));
    },
    { deep: true }
);

function askAndResetSpaces() {
    ModalController.open(ConfirmModal, {
        title: 'Bingo Felder zurücksetzen',
        message: 'Möchtest du die Bingo Felder mischen und zurücksetzen?',
        confirmText: 'Ja, zurücksetzen',
        cancelText: 'Nein, abbrechen',
        isConfirmButtonCta: true,
        onConfirm: () => {
            resetSpaces();
            ModalController.close();
        },
        onCancel: () => {
            ModalController.close();
        }
    });
}

function resetSpaces() {
    // Clear entries
    data.value.entries = [];

    // Randomize the spaces
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

    // Save spaces to localstorage
    localStorage.setItem('bingo-spaces', JSON.stringify(spaces.value));
}

function toggleEntryByIndex(index: number) {
    if (data.value.entries.some((entry) => entry.index === index)) {
        // If the entry is already crossed out, remove it
        data.value.entries = data.value.entries.filter(
            (entry) => entry.index !== index
        );
    } else {
        // Otherwise, add it
        data.value.entries.push({
            index: index,
            date: new Date().getTime()
        });
    }
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
    max-width: 64rem;
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

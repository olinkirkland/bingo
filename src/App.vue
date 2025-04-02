<template>
    <div class="app">
        <section>
            <div>
                <h1>DB Bingo</h1>
                <em>Programmiert von Olin • Idee von Brenden</em>
            </div>
            <p>
                Klicke auf die Felder, um sie durchzustreichen. Klicke erneut
                auf ein Feld, um es wieder zu entfernen.
            </p>
        </section>

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

        <section>
            <Button @click="claimBingo" primary v-if="isBingo()">
                <i class="fas fa-share-alt"></i>
                <span>Bingo teilen</span>
            </Button>

            <Button @click="askAndResetSpaces">
                <i class="fas fa-random"></i>
                <span>Felder mischen</span></Button
            >
        </section>
    </div>
    <the-modal-container />
</template>

<script setup lang="ts">
import stoerungen from '@/assets/stoerungen.json';
import { ref, watch } from 'vue';
import ConfirmModal from './components/modals/templates/ConfirmModal.vue';
import TheModalContainer from './components/modals/TheModalContainer.vue';
import Button from './components/ui/Button.vue';
import ModalController from './controllers/modal-controller';

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

function isBingo() {
    // Detect if there is a bingo
    // Check rows, columns, and diagonals
    const bingoPatterns = [
        // Rows
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        // Columns
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        // Diagonals
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    return bingoPatterns.some((pattern) =>
        pattern.every((index) =>
            data.value.entries.some((entry) => entry.index === index)
        )
    );
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

function claimBingo() {
    const oldestDate = Math.min(
        ...data.value.entries.map((entry) => entry.date)
    );
    const recentDate = Math.max(
        ...data.value.entries.map((entry) => entry.date)
    );
    const daysTaken =
        Math.floor((recentDate - oldestDate) / (1000 * 60 * 60 * 24)) || 1;

    // Create a Bingo string like how the Wordle does it
    let bingoString = `DB Bingo (${daysTaken} days)`;

    // 🟥⬛

    // 5x5 grid, made of 5x5 squares
    const grid = Array.from({ length: 5 }, () => Array(5).fill('⬛'));
    data.value.entries.forEach((entry) => {
        const index = entry.index;
        const row = Math.floor(index / 5);
        const col = index % 5;
        grid[row][col] = '🟥';
    });

    bingoString += '\n\n';
    grid.forEach((row) => {
        bingoString += row.join('') + '\n';
    });

    // Send the Bingo string
    sendSMS(bingoString);
}

function sendSMS(bingoString: string) {
    console.log('navigator.userAgent', navigator.userAgent);
    console.log(bingoString);

    if (navigator.userAgent.match(/Android/i)) {
        window.open(`sms:?body=${encodeURIComponent(bingoString)}`, '_self');
    } else if (navigator.userAgent.match(/iPhone/i)) {
        window.open(`sms:?body=${encodeURIComponent(bingoString)}`, '_self');
    } else {
        // Copy it to the clipboard
        navigator.clipboard.writeText(bingoString).then(() => {
            // Show a success message
            ModalController.open(ConfirmModal, {
                title: 'Bingo!',
                message: `<em>Bingo Nachricht wurde kopiert!</em><br/><br/>${bingoString.replaceAll('\n', '<br/>')}`,
                confirmText: 'OK',
                cancelText: null,
                onConfirm: () => {
                    ModalController.close();
                }
            });
        });
    }
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
    gap: 1.6rem;

    section {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        em {
            text-transform: uppercase;
            font-size: 1rem;
            letter-spacing: 0.1rem;
            opacity: 0.8;
        }
    }
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

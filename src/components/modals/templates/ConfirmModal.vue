<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader>
                <h3>{{ props.title }}</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="confirm">
                <p v-html="props.message"></p>

                <div class="choices">
                    <Button class="btn" @click="onClickCancel">
                        <span>{{ props.cancelText || 'Cancel' }}</span>
                    </Button>
                    <Button
                        class="btn"
                        :primary="props.isConfirmButtonCta"
                        @click="props.onConfirm"
                    >
                        <span>{{ props.confirmText || 'Confirm' }}</span>
                    </Button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import Button from '@/components/ui/Button.vue';
import ModalController from '@/controllers/modal-controller';

const props = defineProps<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirmButtonCta?: boolean;
}>();

function onClickCancel() {
    props.onCancel ? props.onCancel() : ModalController.close();
}
</script>

<style scoped lang="scss">
.confirm {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}

.choices {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .confirm {
        flex: 1;
    }

    .choices {
        flex-direction: column-reverse;
    }
}
</style>

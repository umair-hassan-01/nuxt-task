<template>
    <v-dialog v-model="dialog" max-width="65%" persistent>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" class="mx-2 red--text" prepend-icon="mdi-plus" color="secondary">ADD
                ICON</v-btn>

        </template>

        <v-card>
            <template v-slot:text>
                <!-- image cards component -->
                <h1 class="text-3xl font-bold text-center">Choose New Icon</h1>
                <div class="my-4">
                    <v-row>
                        <v-col v-for="(icon, index) in availableIcons" :key="index" cols="12" sm="6" md="6"
                            class="d-flex align-center justify-center">
                            <div :class="{ 'selected': selectedIcon === icon }" class="image-wrapper"
                                @click="selectIcon(icon)">
                                <img :src="icon" alt="Icon" class="image">
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </template>

            <template v-slot:actions>
                <v-spacer>

                </v-spacer>

                <v-btn @click="dialog = false"> CANCEL </v-btn>

                <v-btn @click="confirmIcon"> CREATE </v-btn>
            </template>
        </v-card>
    </v-dialog>

    <div class="my-4">
        <img :src="seasonState.metaData.iconUrl" alt="">
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type ISeason from '~/interfaces/season/season';

const availableIcons = ref([
    'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZZcLgcl2-BWVsu9Yw6KAV8fnkn1LG_tCA7A&s',
]
);

const dialog = ref(false);
const seasonState = useState('seasonState') as Ref<ISeason>;
const selectedIcon: Ref<string> = ref(seasonState.value.metaData.iconUrl);

function selectIcon(imageUrl: string) {
    selectedIcon.value = imageUrl;
}

function confirmIcon() {
    seasonState.value.metaData.iconUrl = selectedIcon.value;
    dialog.value = false;
}
</script>

<style scoped>
.image-wrapper {
    position: relative;
    display: inline-block;
}

.image {
    width: 100%;
    /* Adjust as needed */
    transition: all 0.3s ease;
}

.selected {
    border: 4px solid #007bff;
    /* Highlight border color */
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
    /* Shadow effect */
}

.image-wrapper:hover .image {
    opacity: 0.9;
    /* Optional: Slightly reduce opacity on hover */
}
</style>

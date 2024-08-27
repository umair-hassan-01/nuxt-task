<template>
    <h1 class="font-bold text-3xl text-center my-4">Championship Section</h1>
    <div class="flex justify-between m-4">
        <div>
            <h1 class="text-2xl md:font-bold">Events</h1>
        </div>
        <div>
            <div class="flex justify-end align-center items-between">
                <v-dialog v-model="dialog" max-width="65%" persistent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" class="mx-2 red--text" prepend-icon="mdi-plus"
                            variant="outlined">CREATE</v-btn>

                    </template>

                    <v-card>
                        <template v-slot:text>
                            <seasons-championship-form @event-form-emit="eventFormEmit" :current-event="anEvent" />
                        </template>
                        <template v-slot:actions>
                            <v-spacer>

                            </v-spacer>

                            <v-btn @click="dialog = false" color="error"> CANCEL </v-btn>

                            <v-btn @click="submitEventForm" color="primary"> CREATE </v-btn>
                        </template>
                    </v-card>
                </v-dialog>
                <v-btn @click="copyEvents" class="mx-2 red--text" prepend-icon="mdi-content-copy"
                    variant="outlined" color="secondary">COPY</v-btn>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-content-paste" variant="outlined" color="primary">PASTE</v-btn>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-delete-outline" variant="outlined" color="error">DELETE</v-btn>
            </div>
        </div>

    </div>

    <div>
        <h1>selected = {{ selected }}</h1>
    </div>
    <v-container>
        <!-- Search Section -->
        <v-row>
            <v-col cols="8">
                <v-text-field v-model="seasonName" class="ma-2" density="compact" placeholder="Search..." hide-details
                    full-width></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-btn class="bg-primary" size="large" @click="handleTableSearch">Search</v-btn>
            </v-col>
        </v-row>
        <v-data-table-server class="row-height-50" v-model="selected" show-select :headers="headers"
            :items="serverItems" :items-length="totalItems" :loading="loading" :search="search" item-value="title"
            @update:options="loadItems" @click:row="handleCheckBoxClick" v-model:items-per-page="itemsPerPage">

            <template v-slot:item.logo="{ item }">
                <v-img :src="item.logo" class="rounded w-96" max-width="100" max-height="100"></v-img>
            </template>
        </v-data-table-server>
    </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from 'vue';
import type ISeasonEvent from '~/interfaces/season/event';
import { useRouter } from 'vue-router';
import type ISeason from '~/interfaces/season/season';

let seasonState = useState('seasonState') as Ref<ISeason>;
const events: ISeasonEvent[] = seasonState.value.eventsData;

// Default data for event form
const defaults = useDefaults();
let currentEvent: ISeasonEvent = defaults.getDefaultEvent();

// Fake API for fetching data
const serverAPI = {
    async fetch({ page, itemsPerPage, name }: any) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        let items = events.slice();
        items = items.filter(item => item.title.toLowerCase().includes(name.toLowerCase()));
        const paginatedItems = items.slice(start, end);
        return {
            items: paginatedItems,
            total: items.length
        };
    }
};

// Reactive state
const dialog = ref(false);
const singleSelect = ref(false);
const selected = ref<ISeasonEvent[]>([]);
const itemsPerPage = ref(5);
const search = ref('');
const serverItems = ref<ISeasonEvent[]>([]);
const loading = ref(true);
const totalItems = ref(0);
const seasonName = ref('');
const calories = ref('');
const anEvent = ref<ISeasonEvent>(currentEvent);

// Load items from serverAPI
async function loadItems({ page, itemsPerPage }: any) {
    loading.value = true;
    const { items, total } = await serverAPI.fetch({ page, itemsPerPage, name: seasonName.value });
    serverItems.value = items;
    totalItems.value = total;
    loading.value = false;
}

// Handle checkbox click
function handleCheckBoxClick(event: any) {
    console.log(event);
}

// Handle table search
function handleTableSearch() {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
}

// Handle season creation navigation
function handleCreateSeasons() {
    const router = useRouter();
    router.push('/seasons/create');
}

// Emit event form data
function eventFormEmit(newEventFormData: ISeasonEvent) {
    console.log(anEvent.value);
}

// Submit event form
function submitEventForm() {
    const seasonValidator = useSeasonValidators(); // Assume this is a composable for validation
    let formValid = false;

    if (seasonValidator.validateSeasonEvent(anEvent.value)) {
        let copyCurrentEvent = { ...anEvent.value };
        events.push(copyCurrentEvent);
        anEvent.value = defaults.getDefaultEvent();
        handleTableSearch();
        formValid = true;
    }

    dialog.value = !formValid;
}

// copy all events to clipboard....
function copyEvents() {
    navigator.clipboard.writeText(JSON.stringify(events));
}


// Initial data load
onMounted(() => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
});
</script>
/*

seasons:
index.vue
createSeason.vue

*/
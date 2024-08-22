<template>
    <div class="flex justify-end">

    </div>
    <div class="flex justify-between m-4">
        <div>
            <h1 class="text-2xl md:font-bold">Events:</h1>
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

                            <v-btn @click="dialog = false"> CANCEL </v-btn>

                            <v-btn @click="submitEventForm"> CREATE </v-btn>
                        </template>
                    </v-card>
                </v-dialog>
                <v-btn @click="copyEvents" class="mx-2 red--text" prepend-icon="mdi-content-copy"
                    variant="outlined">COPY</v-btn>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-content-paste" variant="outlined">PASTE</v-btn>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-delete-outline" variant="outlined">DELETE</v-btn>
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

// Define emits
const emit = defineEmits(['championship-emit']);
const props = defineProps({
    events: {
        type: Object as PropType<ISeasonEvent[]>,
        required: true
    }
});

// Sample events data
const events: ISeasonEvent[] = props.events;

// Function to get current ISO 8601 with timezone offset
function getCurrentIso8601WithTimezone() {
    const now = new Date();
    const isoString = now.toISOString();
    console.log("ISO string is ", isoString);

    const offset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    const formattedOffset = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    return isoString.replace('Z', formattedOffset);
}

// Default data for event form
const currentEvent: ISeasonEvent = {
    id: 1,
    title: 'dummy title',
    eventType: 'weekly',
    startTime: '2022-06-15T13:15:00+05:00',
    endTime: '2022-06-15T13:15:00+05:00',
    qualifierDuration: 0,
    tournamentDuration: 0,
    tickets: 0,
    prizePool: 0
};

// Fake API for fetching data
const FakeAPI = {
    async fetch({ page, itemsPerPage, name }: any) {
        console.log("name = " + name);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        let items = events.slice();
        items = items.filter(item => item.title.toLowerCase().includes(name.toLowerCase()));
        const paginatedItems = items.slice(start, end);
        console.log(paginatedItems);
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

// Load items from FakeAPI
async function loadItems({ page, itemsPerPage }: any) {
    loading.value = true;
    const { items, total } = await FakeAPI.fetch({ page, itemsPerPage, name: seasonName.value });
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
    console.log("Going to validate the form");
    const seasonValidator = useSeasonValidators(); // Assume this is a composable for validation
    let formValid = false;

    if (seasonValidator.validateSeasonEvent(anEvent.value)) {
        let copyCurrentEvent = { ...currentEvent };
        events.push(copyCurrentEvent);
        handleTableSearch();
        formValid = true;
        emit('championship-emit', events);
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
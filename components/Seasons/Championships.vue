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
                    variant="outlined" color="secondary">COPY ALL</v-btn>
                <v-btn @click="copySelectedEvents" class="mx-2 red--text" prepend-icon="mdi-content-copy"
                     variant="outlined" color="secondary">COPY</v-btn>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-content-paste" variant="outlined" color="primary" @click="pasteEvents">PASTE</v-btn>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-delete-outline" variant="outlined" color="error" @click="deleteEvents">DELETE</v-btn>
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
            :items="serverItems" :items-length="totalItems" :loading="loading" :search="search" item-value="eventId"
            @update:options="loadItems" @click:row="handleCheckBoxClick" v-model:items-per-page="itemsPerPage">

          <template v-slot:item.operations="{item}" >
            <div>
              <v-btn density="compact" icon="mdi-content-copy" @click="copySingleEvent(item.eventId)"></v-btn>
              <v-btn density="compact" icon="mdi-square-edit-outline" @click="editSingleEvent(item.eventId)"></v-btn>
            </div>

            <div class="my-2">
              <v-btn density="compact" icon="mdi-plus" @click="duplicateSingleEvent(item.eventId)"></v-btn>
              <v-btn density="compact" icon="mdi-delete-outline" @click="deleteSingleEvent(item.eventId)"></v-btn>
            </div>

          </template>
        </v-data-table-server>
    </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from 'vue';
import type ISeasonEvent from '~/interfaces/season/event';
import { useRouter } from 'vue-router';
import type ISeason from '~/interfaces/season/season';
import {target} from "@vue/devtools-shared";

let seasonState = useState('seasonState') as Ref<ISeason>;
let events: ISeasonEvent[] = seasonState.value.eventsData;

// Default data for event form
const defaults = useDefaults();
let currentEvent: ISeasonEvent = defaults.getDefaultEvent(seasonState.value.metaData.seasonId);

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
const anEvent = ref<ISeasonEvent>(currentEvent);

const headers = [
      {
        title: 'Season Id',
        align: 'start',
        sortable: false,
        key: 'seasonId',
      },
      {
        title: 'Event Id',
        align: 'start',
        sortable: false,
        key: 'eventId',
      },
      {
        title: 'Event Title',
        align: 'start',
        sortable: false,
        key: 'title',
      },
      { title: 'Title', key: 'eventType', align: 'start', sortable: false },
      { title: 'Start Time', key: 'startTime', align: 'end' },
      { title: 'End Time', key: 'endTime', align: 'end' },
      { title: 'Qualifier Duration', key: 'qualifierDuration', align: 'end' },
      { title: "Tournament Duration", key: "tournamentDuration", align: "end" },
      { title: 'Tickets', key: 'tickets', align: 'end' },
      { title: 'Prize Pool', key: 'prizePool', align: 'end' },
      { title: 'Created At', key: 'created_at', align: 'end' },
      { title: 'Updated At', key: 'updated_at', align: 'end' },
      { title: 'Operations', key: 'operations', align: 'end' },
    ];

// Load items from serverAPI
async function loadItems({ page, itemsPerPage }: any) {
    loading.value = true;
    const { items, total } = await serverAPI.fetch({ page, itemsPerPage, name: seasonName.value });
    serverItems.value = items;
    totalItems.value = total;
    loading.value = false;
}

function refreshTable(){
  loadItems({
    page:1,
    itemsPerPage:itemsPerPage.value
  });
}
// Handle checkbox click
function handleCheckBoxClick(event: any) {

}

// Handle table search
function handleTableSearch() {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
}

// Emit event form data
function eventFormEmit(newEventFormData: ISeasonEvent) {

}

// Submit event form
function submitEventForm() {
    const seasonValidator = useSeasonValidators(); // Assume this is a composable for validation
    let formValid = false;

    if (seasonValidator.validateSeasonEvent(anEvent.value)) {
        let copyCurrentEvent = { ...anEvent.value };
        events.splice(0 , events.length,...events.filter(e=>e.eventId !== copyCurrentEvent.eventId));
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

// copy selected events...
function copySelectedEvents(){
  let selectedOnes = serverItems.value.filter(item=>selected.value.includes(item.eventId));
  navigator.clipboard.writeText(JSON.stringify(selectedOnes));
}

// paste events...
function pasteEvents(){
  console.log("Paste events called");
}

// delete selected events....
function deleteEvents(){
  console.log("Delete events called");
  events.splice(0 , events.length , ...events.filter(event=>(selected.value.includes(event.eventId))===false));
  refreshTable();
}


// copy single event to clipboard...
function copySingleEvent(eventId:string){
  const targetItem = serverItems.value.find(e=>e.eventId === eventId);
  navigator.clipboard.writeText(JSON.stringify(targetItem));
}

// delete single event...
function deleteSingleEvent(eventId:string){
  events.splice(0 , events.length , ...events.filter(e=>e.eventId !== eventId));
  refreshTable();
}

// edit single event...
function editSingleEvent(eventId:string){
  anEvent.value = events.find(e=>e.eventId === eventId);
  console.log("Edit this");
  console.log(events);
  events.forEach(event=>{
    if(event.eventId === eventId){
      console.log(event);
      anEvent.value = {...event};
    }
  })
  console.log(anEvent.value);
  dialog.value = true;
}

// duplicate single event...
function duplicateSingleEvent(eventId:string){
  // get the target event
  let targetEvent = serverItems.value.find(item=>item.eventId === eventId);

  // change event id
  targetEvent = JSON.parse(JSON.stringify((targetEvent)));
  targetEvent.eventId = crypto.randomUUID();
  events.push(targetEvent);
  refreshTable();
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
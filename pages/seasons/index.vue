<template>
    <h1 class="text-2xl md:font-bold">Seasons Table:</h1>
    <div class="flex justify-end">
        <v-btn class="bg-primary" ize="x-large" prepend-icon="mdi-plus" @click="handleCreateSeasons(undefined)">Add New
            Season</v-btn>

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
                <v-btn class="bg-primary" size="large" @click="refreshTable">Search</v-btn>
            </v-col>
        </v-row>
        <v-data-table-server class="row-height-50" v-model="selected" show-select :headers="headers"
            :items="serverItems" :items-length="totalItems" :loading="loading" :search="search" item-value="seasonId"
            @update:options="loadItems" v-model:items-per-page="itemsPerPage">

            <template v-slot:item.logo="{ item }">
                <v-img :src="item.logo" class="rounded w-96" max-width="100" max-height="100"></v-img>
            </template>
            <template v-slot:item.operations="{ item }">
                <v-btn density="compact" icon="mdi-content-copy" @click="copyEvent(item)"></v-btn>
                <v-btn density="compact" icon="mdi-square-edit-outline"
                    @click="handleCreateSeasons(item.seasonId)"></v-btn>
                <v-btn density="compact" icon="mdi-plus" @click="generateDuplicate(item.seasonId)"></v-btn>
            </template>
        </v-data-table-server>
    </v-container>
</template>
<style>
.v-data-table.row-height-50 td {
    height: 80px !important;
}
</style>

<script>

let simpleSeasons = ref([]);

const FakeAPI = {
    async fetch({ page, itemsPerPage, name }) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        let items = simpleSeasons.value.slice();
        // apply search[name parameter] filter on items....
        items = items.filter(item => item.title.toLowerCase().includes(name.toLowerCase()));

        // now paginate the selected items....
        let paginatedItems = items.slice(start, end);

        return {
            items: paginatedItems,
            total: items.length
        };
    }
}

export default {
    data: () => ({
        singleSelect: false,
        selected: [],
        itemsPerPage: 5,
        headers: [
            {
                title: 'ID',
                align: 'start',
                sortable: false,
                key: 'seasonId',
            },
            {
                title: "Logo",
                align: "start",
                sortable: false,
                key: "logo"
            },
            { title: 'Title', key: 'title', align: 'start', sortable: false },
            { title: 'Date', key: 'date', align: 'end' },
            { title: 'Pushed To Nakama', key: 'nakamaPush', align: 'end' },
            { title: 'Events', key: 'events', align: 'end' },
            { title: "Theme", key: "theme", align: "end" },
            { title: 'Updated At', key: 'updated_at', align: 'end' },
            { title: "Operations", key: "operations", align: "end" }
        ],
        search: '',
        serverItems: [],
        loading: true,
        totalItems: 0,
        seasonName: "",
        calories: ""
    }),
    methods: {
        loadItems({ page, itemsPerPage }) {
            this.loading = true
            let name = this.seasonName;
            FakeAPI.fetch({ page, itemsPerPage, name }).then(({ items, total }) => {
                this.serverItems = items
                this.totalItems = total
                this.loading = false
            })
        },

        handleRowClick(event, row) {
            console.log(row.item);
        },

        refreshTable() {
            this.loadItems({
                page: 1,
                itemsPerPage: this.itemsPerPage,
                sortBy: []
            });
        },

        handleCreateSeasons(seasonId) {
            const router = useRouter();
            if (seasonId === undefined)
                router.push('/seasons/create');
            else
                router.push(`/seasons/create?seasonId=${seasonId}`);
        },

        async generateDuplicate(seasonId) {

            const { data } = await useFetch('/api/seasons/duplicate', {
                "method": "POST",
                "body": {
                    "seasonId": seasonId
                }
            });

            if (data.value.success) {
                const meta = data.value.season.metaData;
                const season = data.value.season.eventsData;

                let currentSimpleSeason = {
                    date: meta.startTime,
                    seasonId: meta.seasonId,
                    logo: 'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
                    title: meta.seasonTitle,
                    nakamaPush: false,
                    events: season.length,
                    theme: meta.theme,
                    updated_at: meta.updated_at
                };
                simpleSeasons.value.push(currentSimpleSeason);
                this.refreshTable();
            } else {
                console.log("error in duplication");
            }
        },

        async fetchSeasons() {
            const seasons = await useFetch('/api/seasons');

            simpleSeasons.value = JSON.parse(JSON.stringify(seasons.data.value));

            if (simpleSeasons.value === null)
                simpleSeasons.value = [];

            this.refreshTable();
        },

        copyEvent(item) {
            navigator.clipboard.writeText(JSON.stringify(item));
        }
    },
    async mounted() {
        console.log("Mount called");
        await this.fetchSeasons();
    }
};

</script>

/*

seasons:
index.vue
createSeason.vue

*/
<template>
    <h1 class="text-2xl md:font-bold">Seasons Table:</h1>
    <div class="flex justify-end">
        <v-btn class="bg-primary" ize="x-large" prepend-icon="mdi-plus" @click="handleCreateSeasons(undefined)">Add New
            Season</v-btn>
        <v-btn @click="pushToNakama" class="mx-2 red--text" prepend-icon="mdi-upload" color="indigo">Push To Nakama
        </v-btn>
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

            <template v-slot:item.iconUrl="{ item }">
                <v-img :src="item.iconUrl" class="rounded w-96" max-width="100" max-height="100"></v-img>
            </template>
            <template v-slot:item.operations="{ item }">
                <div>
                    <v-btn density="compact" icon="mdi-content-copy" @click="copyEvent(item)"></v-btn>
                    <v-btn density="compact" icon="mdi-square-edit-outline"
                        @click="handleCreateSeasons(item.seasonId)"></v-btn>
                </div>

                <div class="my-2">
                    <v-btn density="compact" icon="mdi-plus" @click="generateDuplicate(item.seasonId)"></v-btn>
                    <v-btn density="compact" icon="mdi-delete-outline" @click="deleteSeason(item.seasonId)"></v-btn>
                </div>

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
let lastPage = ref(0);
let lastSmall = ref(10000);
let lastLarge = ref(0);

const FakeAPI = {
    async fetch({ page, itemsPerPage, name }) {

        // load items from backend server
        let url = `/api/seasons?items=${itemsPerPage}&currentPage=${page}&search=${name}`;
        const seasons = await useFetch(url);
        let totalCount = 0;
        if (seasons.data.value) {
          simpleSeasons.value = seasons.data.value.paginatedSeasons;
          totalCount = seasons.data.value.totalCount;
        }
        else {
          simpleSeasons.value = [];
        }

        return {
            items: simpleSeasons.value,
            total: totalCount
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
              title: 'Season Number',
              align: 'start',
              sortable: false,
              key: 'seasonNumber',
            },
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
                key: "iconUrl"
            },
            { title: 'Title', key: 'seasonTitle', align: 'start', sortable: false },
            { title: 'Date', key: 'startTime', align: 'end' },
            { title: 'Pushed To Nakama', key: 'pushToNakama', align: 'end' },
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

            if(page === 1)
              this.setPaginationDefault();

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
                    startTime: meta.startTime,
                    seasonId: meta.seasonId,
                    seasonNumber:meta.seasonNumber,
                    iconUrl: meta.iconUrl,
                    seasonTitle: meta.seasonTitle,
                    pushToNakama: false,
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
            this.refreshTable();
        },
        async setPaginationDefault() {
          lastSmall = ref(10000);
          lastLarge = ref(0);
          lastPage = ref(0);
        },
        copyEvent(item) {
            navigator.clipboard.writeText(JSON.stringify(item));
        },

        async pushToNakama() {
            try {
                const { data } = await useFetch('/api/seasons/nakamaPush', {
                    "method": "POST",
                    "body": {
                        "selected": this.selected
                    }
                });
                if (data.value.success) {
                    // update values locally...
                    await this.fetchSeasons(); // really ineffcient method .. we can update values locally or with help of server side pagination we can imporve it
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteSeason(seasonId){
            console.log("delete season with id " + seasonId);
            try{
                const {error , data} = await useFetch('/api/seasons/delete' , {
                    "method":"POST",
                    "body":{
                        "seasonId":seasonId
                    }
                });

                if(error.value)
                    throw error;

                // remove data locally...
                simpleSeasons.value = simpleSeasons.value.filter(season=>season.seasonId!==seasonId);
                console.log(simpleSeasons);
                this.refreshTable();
            }catch(error){
                console.log("Error occured");
                console.log(error);
            }
        }
    },
    async mounted() {
        console.log("Mount called");
        lastSmall = ref(10000);
        lastLarge = ref(0);
        lastPage = ref(0);
        await this.fetchSeasons();
    }
};

</script>

/*

seasons:
index.vue
createSeason.vue


if name is sorted then what ? ... keyset = (name , number)

*/
<template>
    <div class="flex justify-end">

    </div>
    <div class="flex justify-between m-4">
        <div>
            <h1 class="text-2xl md:font-bold">Events:</h1>
        </div>
        <div>
            <div class="flex justify-end align-center items-between">
                <v-dialog v-model="dialog" max-width="400" persistent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" class="mx-2 red--text" prepend-icon="mdi-plus" variant="outlined">CREATE</v-btn>

                    </template>

                    <v-card>
                        <template v-slot:actions>
                            <v-spacer></v-spacer>

                            <v-btn @click="dialog = false"> Disagree </v-btn>

                            <v-btn @click="dialog = false"> Agree </v-btn>
                        </template>
                    </v-card>
                </v-dialog>
                <v-btn class="mx-2 red--text" prepend-icon="mdi-content-copy" variant="outlined">COPY</v-btn>
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
            :items="serverItems" :items-length="totalItems" :loading="loading" :search="search" item-value="name"
            @update:options="loadItems" @click:row="handleCheckBoxClick" v-model:items-per-page="itemsPerPage">

            <template v-slot:item.logo="{ item }">
                <v-img :src="item.logo" class="rounded w-96" max-width="100" max-height="100"></v-img>
            </template>
        </v-data-table-server>
    </v-container>
</template>

<script>

const events = [
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Winter Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },
    {
        id: "1",
        title: 'Pre Summer Games',
        eventType: "weekly",
        startTime: "25 Aug 2024",
        endTime: "30 Aug 2024",
        qualifierDuration: "1 Days",
        tournamentDuration: "5 Days",
        tickets: "5",
        prizePool: "$100"
    },

]
const FakeAPI = {
    async fetch({ page, itemsPerPage, name }) {
        console.log("name = " + name);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        console.log(itemsPerPage);
        let items = events.slice();
        // apply search[name parameter] filter on items....
        items = items.filter(item => item.title.toLowerCase().includes(name.toLowerCase()));

        // now paginate the selected items....
        let paginatedItems = items.slice(start, end);
        console.log(paginatedItems);
        return {
            items: paginatedItems,
            total: items.length
        };
    }
}

export default {
    data: () => ({
        dialog:false,
        singleSelect: false,
        selected: [],
        itemsPerPage: 5,
        headers: [
            {
                title: 'ID',
                align: 'start',
                sortable: false,
                key: 'id',
            },
            { title: 'Title', key: 'title', align: 'start', sortable: false },
            { title: 'Event Type', key: 'eventType', align: 'end' },
            { title: 'Start Time', key: 'startTime', align: 'end' },
            { title: 'End Time', key: 'endTime', align: 'end' },
            { title: "Qualifier Duration", key: "qualifierDuration", align: "end" },
            { title: 'Tournament Duration', key: 'tournamentDuration', align: 'end' },
            { title: "Tickets", key: "tickets", align: "end" },
            { title: "Prize Pool", key: "prizePool", align: "end" },
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

        handleCheckBoxClick(event) {
            console.log(event);
        },

        handleTableSearch() {
            this.loadItems({
                page: 1,
                itemsPerPage: this.itemsPerPage,
                sortBy: []
            });
        },

        handleCreateSeasons() {
            const router = useRouter();
            router.push('/seasons/create');
        },
    },
}
</script>

/*

seasons:
index.vue
createSeason.vue

*/
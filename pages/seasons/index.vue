<template>
    <h1 class="text-2xl md:font-bold">Seasons Table:</h1>
    <div class="flex justify-end">
        <v-btn class="bg-primary" ize="x-large" prepend-icon="mdi-plus" @click="handleCreateSeasons">Add New Season</v-btn>

    </div>
    <div>
        <h1>selected  = {{ selected }}</h1>
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
        <v-data-table-server class="row-height-50" v-model="selected" show-select :headers="headers" :items="serverItems"
            :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems"
            @click:row="handleCheckBoxClick" v-model:items-per-page="itemsPerPage">

            <template v-slot:item.logo="{ item }">
                <v-img :src="item.logo" class="rounded w-96" max-width="100" max-height="100"></v-img>
            </template>
        </v-data-table-server>
    </v-container>
</template>
<style>
.v-data-table.row-height-50 td
{
  height: 80px !important;
}
</style>

<script>

const desserts = [
    {
        id:"1",
        logo:'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
        title: 'Pre Winter Games',
        date:"7 Aug 2024",
        nakama_push:false,
        events:2,
        theme:4,
        updated_at:"2024 Aug 29 10:00 AM",
        operations:"no"
    },
    {
        id:"1",
        logo:'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
        title: 'Pre Summer Games',
        date:"7 Aug 2024",
        nakama_push:false,
        events:2,
        theme:4,
        updated_at:"2024 Aug 29 10:00 AM",
        operations:"no"
    },
    {
        id:"1",
        logo:'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
        title: 'Pre Winter Games',
        date:"7 Aug 2024",
        nakama_push:false,
        events:2,
        theme:4,
        updated_at:"2024 Aug 29 10:00 AM",
        operations:"no"
    },
    {
        id:"1",
        logo:'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
        title: 'Pre Winter Games',
        date:"7 Aug 2024",
        nakama_push:false,
        events:2,
        theme:4,
        updated_at:"2024 Aug 29 10:00 AM",
        operations:"no"
    },
   
]
const FakeAPI = {
    async fetch({ page, itemsPerPage , name }) {
        console.log("name = " + name);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        console.log(itemsPerPage);
        let items = desserts.slice();
        // apply search[name parameter] filter on items....
        items = items.filter(item=>item.title.toLowerCase().includes(name.toLowerCase()));

        // now paginate the selected items....
        let paginatedItems = items.slice(start , end);
        console.log(paginatedItems);
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
                key: 'id',
            },
            {
                title: "Logo",
                align: "start",
                sortable: false,
                key: "logo"
            },
            { title: 'Title', key: 'title', align: 'start',sortable:false },
            { title: 'Date', key: 'date', align: 'end' },
            { title: 'Pushed To Nakama', key: 'nakama_push', align: 'end' },
            { title: 'Events', key: 'events', align: 'end' },
            {title:"Theme" , key:"theme" , align:"end"},
            { title: 'Updated At', key: 'updated_at', align: 'end' },
            {title:"Operations" , key:"operations" , align:"end"}
        ],
        search:'',
        serverItems: [],
        loading: true,
        totalItems: 0,
        seasonName: "",
        calories: ""
    }),
    methods: {
        loadItems ({ page, itemsPerPage }) {
        this.loading = true
        let name = this.seasonName;
        FakeAPI.fetch({ page, itemsPerPage , name }).then(({ items, total }) => {
          this.serverItems = items
          this.totalItems = total
          this.loading = false
        })},

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

        handleCreateSeasons(){
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
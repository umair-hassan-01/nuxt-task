<template>
    <div>
        <h1 class="text-2xl md:font-bold">This is the signout page</h1>
        <v-container>
            <v-row>
                <v-col v-for="(something, index) in somethingsArray" :key="index" cols="12" sm="6" md="6">
                    <h1>This is {{ something }}</h1>
                    <!-- <my-component :my-data="something" /> -->
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>


<script setup>
let somethingsArray = [1, 2, 3, 4];
</script>
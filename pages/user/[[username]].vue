<script setup lang="ts">
interface User{
    user_name:string,
    user_id:string,
    display_name:string
}

let users:User[] = [];

const {getMessage} = useRequestUtils();

users = (await getMessage("/api/users"));

console.log(users);
</script>

<template>
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    User Id
                </th>
                <th scope="col" class="px-6 py-3">
                    User Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Display Name
                </th>
            </tr>
        </thead>
        <tbody v-for="(user , index) in users" :key="index">
            <UserRow :user_name="user.user_name" :user_id="user.user_id" :display_name = "user.display_name"/>
        </tbody>
    </table>
</div>


</template>
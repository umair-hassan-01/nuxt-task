<script setup lang="ts">
const props = defineProps({
    user_name:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    display_name:{
        type:String,
        required:true
    }
})

const {user_name , user_id , display_name} = props;
</script>

<template>
    <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ user_id }}
        </th>
        <td class="px-6 py-4">
            {{ user_name }}
        </td>
        <td class="px-6 py-4">
            {{ display_name }}
        </td>
    </tr>
</template>
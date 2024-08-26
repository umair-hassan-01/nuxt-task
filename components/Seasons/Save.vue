<template>
<h1>this is save section</h1>
</template>

<script setup lang="ts">
import type ISeason from '~/interfaces/season/season';

console.log("Final global state is ");
let seasonState = useState('seasonState') as Ref<ISeason>;
console.log(seasonState);
</script>
<script setup lang="ts">
const {getMessage}  = useRequestUtils();
let message:string = "";

message = <string>(await getMessage("/api/helo?userName=nothing&userId=nothing&displayName=umair"));
</script>

<template>
    <div>
        <h1>{{ message }}</h1>
    </div>
</template>
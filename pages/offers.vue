<template>
<Navbar/>
<h1>this is value {{ state }}</h1>

</template>

<script setup>
const state = useState('value' , ()=>200);
</script>
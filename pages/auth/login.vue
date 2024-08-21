<template>
  <NuxtLayout name="auth-layout">
    <div class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company" />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log In to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        <form @submit.prevent = "handleLogin" class="w-full mx-auto block" action="#" method="POST">
          <json-forms :data="data" :renderers="renderers" :schema="schema" :uischema="uischema" @change="onChange" />
          <!-- Add a submit button to trigger form submission -->
          <a-button
            class="w-full h-12 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
            type="primary" @click.prevent="handleLogin">LogIn</a-button>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500"></p>
        Not a member?
        {{ ' ' }}
        <nuxt-link class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" to="/auth/signup">Sign
          Up</nuxt-link>

      </div>
    </div>
  </NuxtLayout>
</template>



<script lang="ts">
definePageMeta({
  layout:"auth-layout"
})
import componentSchema from '~/scripts/forms';

export default defineComponent(componentSchema);
</script>
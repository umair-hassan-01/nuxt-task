<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <h1>LogIn Form</h1>
    <div class="myform">
      <!-- Wrap the form components inside a <form> tag -->
      <form @submit.prevent="handleSubmit">
        <json-forms
          :data="data"
          :renderers="renderers"
          :schema="schema"
          :uischema="uischema"
          @change="onChange"
        />
        <!-- Add a submit button to trigger form submission -->
        <button type="submit">Submit</button>
      </form>
    </div>
</template>
  

<script lang="ts">
import componentSchema from '~/scripts/forms';

export default defineComponent(componentSchema);
</script>
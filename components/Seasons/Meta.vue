<template>
    <div>
        <JsonForms :data="data" :schema="schema" :uischema="uischema" :renderers="renderers" @change="onChange" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import UserSchema from '~/type_schemas/UserSchema'; // Adjust the path if necessary
import type { JSONSchemaType } from 'ajv';
import type IMeta from '~/interfaces/season/meta';

// Merge styles if needed
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

// Define the schema and UI schema
const schema:JSONSchemaType<IMeta> = {
    "type": "object",
    "properties": {
        "seasonNumber":{
            "type":"number",
            "minimum":1
        },
        "seasonId":{
            "type":"number",
            "minimum":1
        },
        "seasonTitle":{
            "type":"string",
            "minLength":3,
            "maxLength":30
        },
        "theme":{
            "type":"number",
            "minimum":1
        },
        "startTime":{
            "type":"string"
        },
        "endTime":{
            "type":"string"
        }

    },
    "required": ["seasonId" , "seasonNumber" , "seasonTitle" , "theme" , "startTime" , "endTime"],
    "additionalProperties": false
};

const uischema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/seasonNumber',
                },
                {
                    type: 'Control',
                    scope: '#/properties/seasonId',
                },
                {
                    type:"Control",
                    scope:"#/properties/seasonTitle"
                }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/theme',
                },
                {
                    type: 'Control',
                    scope: '#/properties/startTime',
                },
                {
                    type:"Control",
                    scope:"#/properties/endTime"
                }
            ]
        },

    ],
};

// Define the form data
const metaData:IMeta = reactive({
    seasonNumber:1,
    seasonId:1,
    seasonTitle:"",
    theme:1,
    startTime:"",
    endTime:""
});

// Handle form changes
const onChange = (event: JsonFormsChangeEvent) => {
    Object.assign(metaData , event.data);
    console.log(metaData);
};


// Provide the custom renderers and styles
const renderers = Object.freeze([...vuetifyRenderers]);

</script>

<style scoped>
/* Apply custom styles here */
@import '~/assets/css/loginform.css';
/* Adjust the path if necessary */
</style>
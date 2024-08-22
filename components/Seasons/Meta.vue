<template>
    <div>
        <JsonForms :data="metaData" :schema="schema" :uischema="uischema" :renderers="renderers" @change="onChange" />
    </div>
</template>     

<script setup lang="ts">
import { reactive, type PropType } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import UserSchema from '~/type_schemas/UserSchema'; // Adjust the path if necessary
import type { JSONSchemaType } from 'ajv';
import type IMeta from '~/interfaces/season/meta';
import MetaSchema from '~/type_schemas/seasons/MetaSchema';

// Merge styles if needed
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

// Define the schema and UI schema
const schema:JSONSchemaType<IMeta> = MetaSchema;

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
                    "options": {
                        "ampm": true,
                        "dateTimeFormat": "MM/DD/YYYY hh:mm a"
                    }
                },
                {
                    type:"Control",
                    scope:"#/properties/endTime",
                    "options": {
                        "ampm": true,
                        "dateTimeFormat": "MM/DD/YYYY hh:mm a"
                    }
                }
            ]
        },

    ],
};

// get the parent props
const props = defineProps({
    metaData:{
        type:Object as PropType<IMeta>,
        required:true
    }
});

// Define the form data
// const metaData:IMeta = reactive({
//     seasonNumber:1,
//     seasonId:1,
//     seasonTitle:"",
//     theme:1,
//     startTime:"",
//     endTime:""
// });

const metaData:IMeta = reactive(props.metaData);

const emit = defineEmits(['test-emit']);
// Handle form changes
const onChange = (event: JsonFormsChangeEvent) => {
    Object.assign(metaData , event.data);
    console.log(metaData);
    emit('test-emit' , metaData);
};


// Provide the custom renderers and styles
const renderers = Object.freeze([...vuetifyRenderers]);

</script>

<style scoped>
/* Apply custom styles here */
@import '~/assets/css/loginform.css';
/* Adjust the path if necessary */
</style>
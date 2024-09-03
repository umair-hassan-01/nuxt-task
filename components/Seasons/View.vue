<template>
    <h1 class="font-bold text-3xl text-center my-2">View Section</h1>

    <div class="flex flex-row">


        <div style="flex: 0 0 60%; padding: 10px;">
            <div>
                <JsonForms :data="seasonState.metaData" :schema="viewSchema" :uischema="viewUiSchema"
                    :renderers="renderers" @change="handleViewChange" />
            </div>
        </div>
        <div style="flex: 0 0 40%; padding: 10px;">
            <SeasonsViewIcons/>
            <!-- Here comes the logo selection content -->
        </div>
    </div>


</template>

<script setup lang="ts">
import type IView from '~/interfaces/season/view';
import { reactive, type PropType } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import UserSchema from '~/type_schemas/UserSchema'; // Adjust the path if necessary
import type { JSONSchemaType } from 'ajv';
import ViewSchema from '~/type_schemas/seasons/ViewSchema';
import type ISeason from '~/interfaces/season/season';
import MetaSchema from '~/type_schemas/seasons/MetaSchema';
import type IMeta from '~/interfaces/season/meta';

// Merge styles if needed
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });
const viewSchema: JSONSchemaType<IMeta> = MetaSchema;

// reference varaibles ...
const dialog = ref(false);
const viewUiSchema = {
    type: 'VerticalLayout',
    elements: [
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/seasonNumber',
                    "options": {
                      "readOnly": true
                    }
                },
                {
                    type: 'Control',
                    scope: '#/properties/seasonId',
                    "options": {
                      "readOnly": true
                    }
                }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/description',
                }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/ballColor',
                },
                {
                    type: 'Control',
                    scope: '#/properties/clubUrl',
                }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/backgroundUrl',
                },
                {
                    type: 'Control',
                    scope: '#/properties/backgroundBlurUrl',
                }
            ]
        },
        {
            type: "HorizontalLayout",
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/buttonText',
                }
            ]
        },

    ],
};
// edit shared season state...
let seasonState = useState('seasonState') as Ref<ISeason>;
function handleViewChange(event: JsonFormsChangeEvent) {
    Object.assign(seasonState.value.metaData, event.data);
}

const renderers = Object.freeze([...vuetifyRenderers]);

</script>

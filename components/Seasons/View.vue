<template>
    <h1>View Section</h1>

    <div class="flex flex-row justify-between">
        <div>
            <div>
                <JsonForms :data="viewData" :schema="viewSchema" :uischema="viewUiSchema" :renderers="renderers"
                    @change="handleViewChange" />
            </div>

        </div>

        <div>
            <h1>section for logo selection</h1>
            <!-- here comes the json form section -->

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

// Merge styles if needed
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });


const viewSchema: JSONSchemaType<IView> = ViewSchema;

const viewUiSchema = {
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
                    type: "Control",
                    scope: "#/properties/seasonTitle"
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

const props = defineProps({
    viewData: {
        type: Object as PropType<IView>,
        required: true
    }
});

let viewData: IView = reactive(props.viewData);

const emit = defineEmits(['season-view-emit']);
function handleViewChange(event: JsonFormsChangeEvent) {
    Object.assign(viewData, event.data);
    emit('season-view-emit' , viewData);
}

const renderers = Object.freeze([...vuetifyRenderers]);

</script>

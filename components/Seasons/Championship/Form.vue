<template>
    <h1>this is championship form to get information</h1>
    <JsonForms :data="seasonEventData" :schema="eventTypeSchema" :uischema="championShipFormUiSchema"
        :renderers="renderers" @change="onChange" />

</template>

<script setup lang="ts">
import { reactive, type PropType } from 'vue';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import { defaultStyles, mergeStyles, vuetifyRenderers } from '@jsonforms/vue-vuetify';
import type { JSONSchemaType } from 'ajv';
import type ISeasonEvent from '~/interfaces/season/event';
import EventSchema from '~/type_schemas/seasons/EventSchema';
import seasonEventFormSchema from '~/UISchema/seasons/EventSchema';

const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });


const championShipFormUiSchema =seasonEventFormSchema;

const props = defineProps({
    currentEvent: {
        type: Object as PropType<ISeasonEvent>,
        required: true
    }
});

const seasonEventData: ISeasonEvent = reactive(props.currentEvent);
const eventTypeSchema: JSONSchemaType<ISeasonEvent> = EventSchema;
const renderers = Object.freeze([...vuetifyRenderers]);

const emit = defineEmits(['event-form-emit']);
const onChange = (event: JsonFormsChangeEvent) => {
    Object.assign(seasonEventData, event.data);
    emit('event-form-emit', seasonEventData);
}


</script>
<template>
    <h1>View Section</h1>

    <div class="flex flex-row justify-between">
        <div>
            <h1>this is view section</h1>
        </div>

        <div>
            <h1>section for logo selection</h1>
            <!-- here comes the json form section -->
             
        </div>
    </div>

</template>

<script lang="ts">
import type { JSONSchemaType } from 'ajv';
import type IView from '~/interfaces/season/view';

const viewSchema:JSONSchemaType<IView> = {
    "type":"object",
    "properties":{
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
        "backgroundUrl":{
            "type":"string",
            "minLength":3,
            "maxLength":30
        },
        "backgroundBlurUrl":{
            "type":"string",
            "minLength":3,
            "maxLength":30
        },
        "buttonText":{
            "type":"string",
            "minLength":6,
            "maxLength":6
        },
        "description":{
            "type":"string",
            "minLength":3,
            "maxLength":40
        }
    },
    "required":["backgroundBlurUrl","backgroundUrl","buttonText","description","seasonId","seasonNumber","seasonTitle"],
    "additionalProperties":false,
};


</script>

import type { JSONSchemaType } from "ajv";
import type IMeta from "~/interfaces/season/meta";

const MetaSchema: JSONSchemaType<IMeta> = {
    "type": "object",
    "properties": {
        "seasonNumber": {
            "type": "number",
            "minimum": 0,
            "nullable": true
        },
        "seasonId": {
            "type": "string"
        },
        "seasonTitle": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
        },
        "theme": {
            "type": "number",
            "minimum": 1
        },
        "startTime": {
            "type": "string",
            "format": "date-time"
        },
        "endTime": {
            "type": "string",
            "format": "date-time"
        },
        "backgroundUrl": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
        },
        "backgroundBlurUrl": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
        },
        "buttonText": {
            "type": "string",
            "minLength": 3,
            "maxLength": 20
        },
        "description": {
            "type": "string",
            "minLength": 3,
            "maxLength": 40
        },
        "clubUrl": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
        },
        "ballColor": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
            
        },
        "created_at":{
            "type":"string",
            "nullable":true
        },
        "updated_at":{
            "type":"string",
            "nullable":true
        }

    },
    "required": ["seasonId", "seasonTitle", "theme", "startTime", "endTime","backgroundBlurUrl", "backgroundUrl", "buttonText", "description", "ballColor", "clubUrl"],
    "additionalProperties": false
};

export default MetaSchema;
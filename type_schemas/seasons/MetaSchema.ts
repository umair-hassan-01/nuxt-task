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
            "minLength": 5,
            "format":"url"
        },
        "backgroundBlurUrl": {
            "type": "string",
            "minLength": 5,
            "format":"url"
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
            "minLength": 5,
            "format":"url"
        },
        "ballColor": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30

        },
        "iconUrl": {
            "type": "string",
            "minLength": 5,
            "format":"url"
        },
        "pushToNakama":{
            "type":"boolean"
        }
        ,
        "created_at": {
            "type": "string",
            "nullable": true
        },
        "updated_at": {
            "type": "string",
            "nullable": true
        }

    },
    "required": ["seasonId", "seasonTitle", "theme", "startTime", "endTime", "backgroundBlurUrl", "backgroundUrl", "buttonText", "description", "ballColor", "clubUrl" , "iconUrl" , "pushToNakama"],
    "additionalProperties": false
};

export default MetaSchema;
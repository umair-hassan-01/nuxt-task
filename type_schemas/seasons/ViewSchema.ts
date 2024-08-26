import type { JSONSchemaType } from "ajv";
import type IView from "~/interfaces/season/view";

const ViewSchema: JSONSchemaType<IView> = {
    "type": "object",
    "properties": {
        "seasonNumber": {
            "type": "number",
            "minimum": 1,
            "nullable":true
        },
        "seasonId": {
            "type": "string"
        },
        "seasonTitle": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
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
            "minLength": 6,
            "maxLength": 6
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
    "required": ["backgroundBlurUrl", "backgroundUrl", "buttonText", "description", "seasonId", "seasonTitle", "ballColor", "clubUrl"],
    "additionalProperties": false,
};

export default ViewSchema;
import type { JSONSchemaType } from "ajv";
import type IView from "~/interfaces/season/view";

const ViewSchema: JSONSchemaType<IView> = {
    "type": "object",
    "properties": {
        "seasonNumber": {
            "type": "number",
            "minimum": 1
        },
        "seasonId": {
            "type": "number",
            "minimum": 1
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
            ,
        }
    },
    "required": ["backgroundBlurUrl", "backgroundUrl", "buttonText", "description", "seasonId", "seasonNumber", "seasonTitle", "ballColor", "clubUrl"],
    "additionalProperties": false,
};

export default ViewSchema;
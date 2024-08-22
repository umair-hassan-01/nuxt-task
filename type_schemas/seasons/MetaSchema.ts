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
        }

    },
    "required": ["seasonId", "seasonTitle", "theme", "startTime", "endTime"],
    "additionalProperties": false
};

export default MetaSchema;
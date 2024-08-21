import type { JSONSchemaType } from "ajv";
import type IMeta from "~/interfaces/season/meta";

const MetaSchema:JSONSchemaType<IMeta> = {
    "type": "object",
    "properties": {
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
        "theme":{
            "type":"number",
            "minimum":1
        },
        "startTime":{
            "type":"string",
            "minLength":6,
            "maxLength":6
        },
        "endTime":{
            "type":"string",
            "minLength":6,
            "maxLength":6
        }

    },
    "required": ["seasonId" , "seasonNumber" , "seasonTitle" , "theme" , "startTime" , "endTime"],
    "additionalProperties": false
};

export default MetaSchema;
import type { JSONSchemaType } from "ajv";
import type ISeasonEvent from "~/interfaces/season/event";

const EventSchema:JSONSchemaType<ISeasonEvent>  = {
    "type": "object",
    "properties": {
        "startTime": {
            "type": "string",
            "format": "date-time"
        },
        "title":{
            "type":"string"
        },
        "eventType":{
            "type":"string"
        },
        "endTime":{
            "type":"string",
            "format":"date-time"
        },
        "prizePool":{
            "type":"number",
            "minimum":0
        },
        "qualifierDuration":{
            "type":"number",
            "minimum":5
        },
        "tickets":{
            "type":"number",
            "minimum":1
        },
        "tournamentDuration":{
            "type":"number",
            "minimum":5
        },
        "id":{
            "type":"number",
            "minimum":1
        }
    },

    "required":["endTime" , "startTime","title","tickets","id","qualifierDuration","tournamentDuration","eventType","prizePool"],
    "additionalProperties":false
};

export default EventSchema;
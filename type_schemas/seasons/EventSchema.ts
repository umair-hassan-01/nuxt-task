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
        "eventId":{
            "type":"string"
        },
        "seasonId":{
            "type":"string",
            "nullable":true
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

    "required":["endTime" , "startTime","title","tickets","eventId","qualifierDuration","tournamentDuration","eventType","prizePool"],
    "additionalProperties":false
};

export default EventSchema;
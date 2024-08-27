import { Ajv, type JSONSchemaType } from "ajv";
import type ISeasonEvent from "~/interfaces/season/event";
import type IMeta from "~/interfaces/season/meta";

export default function useHelpers(){
    const ajv = new Ajv();
    ajv.addFormat('date-time', {
        validate: (dateTime: string) => {
            return !isNaN(Date.parse(dateTime)); // Basic validation
        }
    });

    // mixed type of IMeta and ISeasonEvent

    function validateSchema(data:any , schema:JSONSchemaType<IMeta | ISeasonEvent>):boolean{
        const validate = ajv.compile(schema);
        if(validate(data))
            return true;
        return false;
    }

    function sanitize(values:any[]){
        const filtered = values.filter(v=>v !== null);
        return filtered;
    }

    return {
        validateSchema,
        sanitize
    }
}
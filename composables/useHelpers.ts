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
    
    function validateSchema(data:any , schema:JSONSchemaType<IMeta | ISeasonEvent>):boolean{
        const validate = ajv.compile(schema);
        if(validate(data))
            return true;
        return false;
    }


    return {
        validateSchema
    }
}
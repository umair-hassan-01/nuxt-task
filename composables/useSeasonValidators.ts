import Ajv, { type JSONSchemaType } from "ajv";
import type ISeasonEvent from "~/interfaces/season/event";
import type IMeta from "~/interfaces/season/meta";
import type IView from "~/interfaces/season/view";
import EventSchema from "~/type_schemas/seasons/EventSchema";
import MetaSchema from "~/type_schemas/seasons/MetaSchema";
import ViewSchema from "~/type_schemas/seasons/ViewSchema";

export default function useSeasonValidators(){
    const ajv = new Ajv();
    ajv.addFormat('date-time', {
        validate: (dateTime: string) => {
            return !isNaN(Date.parse(dateTime)); // Basic validation
        }
    });
    
    function validateSeasonView(viewData:IView) : boolean{
        const viewSchema:JSONSchemaType<IView> = ViewSchema;
        const validator = ajv.compile(viewSchema);
        if(validator(viewData))
            return true;
        return false;
    }

    function validateSeasonMeta(metaData:IMeta):boolean{
        const metaSchema:JSONSchemaType<IMeta> = MetaSchema;
        const validator = ajv.compile(metaSchema);
        if(validator(metaData))
            return true;
        return false;
    }

    function validateSeasonEvent(eventData:ISeasonEvent):boolean{
        const eventSchema:JSONSchemaType<ISeasonEvent> = EventSchema;
        console.log(eventSchema);
        const validator = ajv.compile(eventSchema);
        if(validator(eventData))
            return true;
        return false;
    }

    return {
        validateSeasonView,
        validateSeasonMeta,
        validateSeasonEvent
    }
}
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

    // custom validator for meta schema...
    const validate = ajv.compile(MetaSchema);

    // Custom validation function
    function validateMeta(data) {
        const isValid = validate(data);

        if (!isValid) {
            return { valid: false, errors: validate.errors };
        }

        const now = dayjs().startOf('day');
        const startTime = dayjs(data.startTime);
        const endTime = dayjs(data.endTime);

        if (startTime.isBefore(now)) {
            return { valid: false, errors: [{ message: 'startTime must be greater than today.' }] };
        }

        if (endTime.isBefore(now)) {
            return { valid: false, errors: [{ message: 'endTime must be greater than today.' }] };
        }

        if (endTime.isBefore(startTime)) {
            return { valid: false, errors: [{ message: 'endTime must be greater than startTime.' }] };
        }

        return { valid: true, errors: [] };
    }

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
        const validator = ajv.compile(eventSchema);
        if(validator(eventData))
            return true;
        return false;
    }

    function validateSeasonEvents(events:ISeasonEvent[]):{valid:boolean,index:number}{
        let validation:boolean[] = [];
        for(let i = 0;i < events.length;i++)
            if(!validateSeasonEvent(events[i]))
                return {valid:false,index:i};
        return {valid:true , index:-1};
    }
    
    return {
        validateSeasonView,
        validateSeasonMeta,
        validateSeasonEvent,
        validateSeasonEvents
    }
}
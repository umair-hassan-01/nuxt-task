import Ajv, { type JSONSchemaType } from "ajv";
import type ISeasonEvent from "~/interfaces/season/event";
import type IMeta from "~/interfaces/season/meta";
import type IView from "~/interfaces/season/view";
import EventSchema from "~/type_schemas/seasons/EventSchema";
import MetaSchema from "~/type_schemas/seasons/MetaSchema";
import ViewSchema from "~/type_schemas/seasons/ViewSchema";
import useHelpers from "~/composables/useHelpers";
import moment from "moment";

export default function useSeasonValidators(){
    const ajv = new Ajv();
    const helpers = useHelpers();

    ajv.addFormat('date-time', {
        validate: (dateTime: string) => {
            return !isNaN(Date.parse(dateTime)); // Basic validation
        }
    });

    ajv.addFormat('url' , {
        validate: (url: string) => {
            return URL.canParse(url);
        }
    });

    function startEndValidation(data:IMeta | ISeasonEvent){
        let startEpochTime = new Date(data.startTime).getTime();
        let endEpochTime = new Date(data.endTime).getTime();
        let currentEpochTime = new Date(Date.now()).getTime();

        let message = "";
        let instancePath = "";
        let valid = true;

        if(startEpochTime <= currentEpochTime){
            instancePath = "Start Time";
            message = "must be greater than current time";
            valid = false;
        }else if(startEpochTime >= endEpochTime){
            instancePath = "End Time";
            message = "must be greater than start time";
            valid = false;
        }

        return { valid: valid, errors: [{message:message , instancePath:instancePath}] };
    }

    // Custom validation function
    function validateMeta(data:IMeta) {
        const validate = ajv.compile(MetaSchema);
        const isValid = validate(data);

        if (!isValid) {
            return { valid: false, errors: validate.errors };
        }

        // check that end time is grated than start time
        return startEndValidation(data);
    }

    function validateEvent(event:ISeasonEvent , meta:IMeta){

        const validate = ajv.compile(EventSchema);
        if(!validate(event)){
            return {
                valid:false,
                errors:validate.errors
            }
        };

        const startEndValid = startEndValidation(event);
        if(!startEndValid.valid)
            return startEndValid;

        const seasonStartEpoch = helpers.dateTimeToEpoch(meta.startTime);
        const seasonEndEpoch = helpers.dateTimeToEpoch(meta.endTime);
        const eventStartEpoch = helpers.dateTimeToEpoch(event.startTime);
        const eventEndEpoch = helpers.dateTimeToEpoch(event.endTime);

        if(!(eventStartEpoch >= seasonStartEpoch && eventEndEpoch <= seasonEndEpoch)){
            return {
                valid:false,
                errors: [{instancePath:'',message:`event must start and end withing season's duration`}]
            }
        }

        return {
            valid:true,
            errors: []
        }
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

    function validateSeasonEvents(events:ISeasonEvent[] , meta:IMeta):{valid:boolean,index:number}{
        for(let i = 0;i < events.length;i++){
            const currentSeason = validateEvent(events[i] , meta);
            if(!currentSeason.valid) {
                currentSeason.errors[0].message += ' in event number ' + (i+1);
                return currentSeason;
            }
        }
        return {valid:true , errors:[]};
    }
    
    return {
        validateSeasonMeta,
        validateSeasonEvent,
        validateSeasonEvents,
        validateMeta,
        validateEvent
    }
}
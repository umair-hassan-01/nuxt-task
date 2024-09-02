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

    function toIsoLocalTime(value) {
        if (!(value instanceof Date))
            value = new Date();
        const off = value.getTimezoneOffset() * -1;
        const del = value.getMilliseconds() ? 'Z' : '.'; // have milliseconds ?
        value = new Date(value.getTime() + off * 60000); // add or subtract time zone
        return value
                .toISOString()
                .split(del)[0]
            + (off < 0 ? '-' : '+')
            + ('0' + Math.abs(Math.floor(off / 60))).substr(-2)
            + ':'
            + ('0' + Math.abs(off % 60)).substr(-2);
    }

    function dateFormatter(value:string){
        return (new Date(value).toLocaleString());
    }

    return {
        validateSchema,
        sanitize,
        toIsoLocalTime,
        dateFormatter
    }
}
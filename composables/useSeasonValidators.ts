import Ajv, { type JSONSchemaType } from "ajv";
import type IMeta from "~/interfaces/season/meta";
import type IView from "~/interfaces/season/view";
import MetaSchema from "~/type_schemas/seasons/MetaSchema";
import ViewSchema from "~/type_schemas/seasons/ViewSchema";

export default function useSeasonValidators(){
    const ajv = new Ajv();

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

    return {
        validateSeasonView,
        validateSeasonMeta
    }
}
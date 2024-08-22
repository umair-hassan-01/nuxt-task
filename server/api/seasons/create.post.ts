import useSeasonValidators from "~/composables/useSeasonValidators";
import seasonQueries from "~/db/DAO/season";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";

export default defineEventHandler(async (event)=>{
    try{
        const seasonData = (await readBody(event)) as unknown as ISeason;
        // need to validate the data first...
        const seasonValidator = useSeasonValidators();

        if(!seasonValidator.validateSeasonMeta(seasonData.metaData)){
            return "NOT VALIDATED";
        }

        delete seasonData.metaData.seasonNumber;
        const response = await seasonQueries().addSeasonMeta(seasonData.metaData);
        return response;
    }catch(error:any){
        console.log(error);
        return "SERVER ERROR OCCURED"
    }
})
import useSeasonValidators from "~/composables/useSeasonValidators";
import seasonQueries from "~/db/DAO/season";
import ISeasonEvent from "~/interfaces/season/event";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";

export default defineEventHandler(async (event)=>{
    try{
        const seasonData = (await readBody(event)) as unknown as ISeason;
        const queries = seasonQueries();
        // need to validate the data first...
        const seasonValidator = useSeasonValidators();

        if(!seasonValidator.validateSeasonMeta(seasonData.metaData)){
            return "NOT VALIDATED";
        }
        if(!seasonValidator.validateSeasonView(seasonData.viewData))
            return "VIEW NOT VALIDATED";
        
        let eventValidation = seasonValidator.validateSeasonEvents(seasonData.eventsData);
        if(!eventValidation.valid)
            return `EVENT NUMBER ${eventValidation.index} IS NOT VALIDATED`;


        delete seasonData.metaData.seasonNumber;
        const newMeta = await seasonQueries().addSeasonMeta([seasonData.metaData]);

       const newView = await queries.addSeasonView([seasonData.viewData]);
        let newEvents:ISeasonEvent[] = [];
        for(let i = 0; i < seasonData.eventsData.length;i++){
            let currentEvent = seasonData.eventsData[i];
            currentEvent.seasonId = newMeta[0].seasonId;
            const currentResponse = await queries.addSeasonEvent([currentEvent]);
            newEvents.push(currentResponse[0]);
        }

        let newSeason:ISeason = {
            metaData:newMeta[0],
            viewData:newView[0],
            eventsData:newEvents
        }
        return newSeason;

    }catch(error:any){
        console.log(error);
        return "SERVER ERROR OCCURED"
    }
})
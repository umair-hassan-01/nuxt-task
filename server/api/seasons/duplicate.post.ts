import useHelpers from "~/composables/useHelpers";
import seasonQueries from "~/db/DAO/season";
import { ICreateSeasonResponse } from "~/interfaces/Response";
import ISeasonEvent from "~/interfaces/season/event";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";

export default defineEventHandler(async (request):Promise<ICreateSeasonResponse>=>{
    try{
        const body = await readBody(request);
        const seasonId = body.seasonId;
        
        const queries = seasonQueries();
        const helper = useHelpers();

        let seasons = (await queries.getAllSeasons({
            seasonId:seasonId
        }));

        if(seasons.length < 1)
            throw new Error("No such season exists");

        const events = seasons[0].events as ISeasonEvent[];
        delete seasons[0].events;
        const meta:IMeta = seasons[0];
        
        delete meta.seasonNumber;

        console.log("existing meta");
        console.log(meta);
        const uuid = crypto.randomUUID();
        meta.seasonId = uuid;

        events.forEach(event=>{
            event.seasonId = uuid;
            event.eventId = crypto.randomUUID();
        });


        const duplicateSeasonMeta = await queries.addSeason(meta);
        const duplicateSeasonEvents = await queries.addSeasonEvent(events);

        setResponseStatus(request , 200);
        return {
            success:true,
            message:"duplicated created",
            season:{
                metaData:duplicateSeasonMeta[0],
                eventsData:duplicateSeasonEvents
            }
        }
    }catch(error:any){
        setResponseStatus(request , 500);
        return {
            success:false,  
            message:error,
            season:null
        }
    }
})
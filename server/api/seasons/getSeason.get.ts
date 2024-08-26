import seasonQueries from "~/db/DAO/season";
import { ICreateSeasonResponse } from "~/interfaces/Response";
import ISeason from "~/interfaces/season/season";

export default defineEventHandler(async (request) => {
    try {

        // fetch seasonId from query parameter...
        const query = getQuery(request);
        let seasonId = undefined;
        if(query.seasonId)
            seasonId = query.seasonId.toString();

        const queries = seasonQueries();
        let response:ISeason[] = [];

        // fetch the season data from database..
        const temp:any[] = await queries.getAllSeasons({
            seasonId:seasonId
        });
        
        temp.forEach(t=>{
            const eventsData = t.events;
            delete t.events;
            const currentSeason:ISeason = {
                metaData:t,
                eventsData:eventsData
            };

            response.push(currentSeason);
        })
        return response;

    } catch (exception: any) {
        console.log(exception);
        return "Some error occured";
    }
})
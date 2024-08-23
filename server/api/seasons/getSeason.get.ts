import seasonQueries from "~/db/DAO/season";
import ISeason from "~/interfaces/season/season";

export default defineEventHandler(async (request) => {
    try {
        // fetch all available seasons from database...
        const query = getQuery(request);
        let seasonId = undefined;
        if(query.seasonId)
            seasonId = query.seasonId.toString();

        const queries = seasonQueries();
        let response:ISeason[] = [];
        const meta = await queries.getSeasonMeta(seasonId);
        
        for(let i = 0;i < meta.length;i++){
            const currentEvent = await queries.getSeasonEvents(meta[i].seasonId);
            const currentView = await queries.getSeasonView(meta[i].seasonId);
            const currentSeason:ISeason = {
                metaData:meta[i],
                viewData:currentView[0],
                eventsData:currentEvent
            };

            response.push(currentSeason);
        }
        return response;
    } catch (exception: any) {
        console.log(exception);
        return "Some error occured";
    }
})
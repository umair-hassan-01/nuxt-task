import seasonQueries from "~/db/DAO/season";
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
        response = await queries.getAllSeasons({
            seasonId:seasonId
        });

        return response;

    } catch (exception: any) {
        console.log(exception);
        return "Some error occured";
    }
})
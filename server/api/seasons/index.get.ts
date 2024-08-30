import seasonQueries from "~/db/DAO/season";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";
import ISimplifiedSeason from "~/interfaces/season/simpleSeason";
import IPaginationFilter from "~/interfaces/season/filters";
import * as dbconfig from "~/db/tableConfigs.json";

interface ISeasonIndexResponse{
    totalCount:number
    paginatedSeasons:ISimplifiedSeason[]
}

interface ISeasonIndexRequest{
    items:string
    lastSmall:string
    lastLarge:string
    isDesc:string
    search:string
}

export default defineEventHandler(async (request):Promise<ISeasonIndexResponse> => {
    const tableNames = dbconfig.databaseConfigs.tableNames;

    try {

        const query:ISeasonIndexRequest = await getQuery(request);
        console.log("hit the backend");

        // fix some defaults
        if(query.items === undefined)
            query.items = '10';

        if(query.lastSmall === undefined)
            query.lastSmall = '0';

        if(query.lastLarge === undefined)
            query.lastLarge = '10000';

        if(query.isDesc === undefined)
            query.isDesc = 'false';
        if(query.search === undefined)
            query.search = '';

        // generate custom pagination filter
        const paginationFilter:IPaginationFilter = {
            itemsPerPage:Number(query.items),
            lastSmallItemNumber:Number(query.lastSmall),
            lastLargeItemNumber:Number(query.lastLarge),
            isDesc:query.isDesc.toLowerCase() === 'true',
            search:query.search
        }

        const queries = seasonQueries();
        const seasons = (await queries.getSimpleSeason({} , paginationFilter)) as ISimplifiedSeason[];
        const count = await queries.countRows(tableNames.seasonTable , paginationFilter.search);


        // just a utility sorting... to keep items in ascending order it user is calling previous page...
        let sortedSeasons = seasons;
        if(paginationFilter.isDesc) {
            sortedSeasons = seasons.sort((a, b) => {
                return (a.seasonNumber > b.seasonNumber) - (a.seasonNumber < b.seasonNumber)
            })
        }

        return {
            totalCount:count,
            paginatedSeasons:sortedSeasons
        }

    } catch (exception: any) {
        console.log(exception);
        return {
            totalCount:0,
            paginatedSeasons:[]
        }
    }
})
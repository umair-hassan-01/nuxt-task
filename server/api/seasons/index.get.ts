import seasonQueries from "~/db/DAO/season";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";
import ISimplifiedSeason from "~/interfaces/season/simpleSeason";
import IPaginationFilter from "~/interfaces/season/filters";
import * as dbconfig from "~/db/tableConfigs.json";
import moment from "moment";

interface ISeasonIndexResponse{
    totalCount:number
    paginatedSeasons:ISimplifiedSeason[]
}

interface ISeasonIndexRequest{
    items:string
    currentPage:string
    search:string
}

export default defineEventHandler(async (request):Promise<ISeasonIndexResponse> => {
    const tableNames = dbconfig.databaseConfigs.tableNames;

    try {

        const query:ISeasonIndexRequest = await getQuery(request);
        console.log("hit the backend");

        // fix some defaults
        if(query.items === undefined)
            query.items = '5';

        if(query.currentPage === undefined)
            query.currentPage = '1';

        if(query.search === undefined)
            query.search = '';

        let items = Number(query.items);
        let page = Number(query.currentPage);

        // generate custom pagination filter
        const paginationFilter:IPaginationFilter = {
            limit:items,
            offset:(page - 1) * items,
            search:query.search
        }

        const queries = seasonQueries();
        const seasons = (await queries.getAllSeasons({} , paginationFilter)) as ISeason[];
        const count = await queries.countRows(tableNames.seasonTable , paginationFilter.search);

        return {
            totalCount:count,
            paginatedSeasons:seasons
        }

    } catch (exception: any) {
        console.log(exception);
        return {
            totalCount:0,
            paginatedSeasons:[]
        }
    }
})
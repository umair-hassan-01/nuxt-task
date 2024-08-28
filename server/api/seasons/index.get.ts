import seasonQueries from "~/db/DAO/season";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";
import ISimplifiedSeason from "~/interfaces/season/simpleSeason";

// seasonId:"1",
// logo:'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
// title: 'Pre Winter Games',
// date:"7 Aug 2024",
// nakama_push:false,
// events:2,
// theme:4,
// updated_at:"2024 Aug 29 10:00 AM",

export default defineEventHandler(async (request):Promise<ISimplifiedSeason[]> => {

    try {

        const queries = seasonQueries();
        const seasons = await queries.getSimpleSeason({});
        return seasons;

    } catch (exception: any) {
        console.log(exception);
        return [];
    }
})
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
        // fetch all available seasons from database...
        const query = getQuery(request);
        let seasonId = undefined;
        if(query.seasonId)
            seasonId = query.seasonId.toString();

        let simplifiedSeasons:ISimplifiedSeason[] = [];
        const queries = seasonQueries();
        const seasonMeta = (await queries.getSeasonMeta({
            seasonId:seasonId
        })) as IMeta[];

        const defaultIcon = 'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg';

        for(let i = 0;i < seasonMeta.length;i++){
            
            let currentSimpleSeason:ISimplifiedSeason = {
                date:seasonMeta[i].startTime,
                seasonId:seasonMeta[i].seasonId,
                logo:seasonMeta[i].iconUrl !== null ? seasonMeta[i].iconUrl : defaultIcon,
                title:seasonMeta[i].seasonTitle,
                nakamaPush:seasonMeta[i].pushToNakama,
                events:10,
                theme:seasonMeta[i].theme,
                updated_at:seasonMeta[i].updated_at as string
            };

            simplifiedSeasons.push(currentSimpleSeason);
        }

        return simplifiedSeasons;
    } catch (exception: any) {
        console.log(exception);
        return [];
    }
})
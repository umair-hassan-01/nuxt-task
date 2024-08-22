import seasonQueries from "~/db/DAO/season";

export default defineEventHandler(async (request)=>{
    try{
    // fetch all available seasons from database...
    const query = getQuery(request);
    const seasonId = query.seasonId;

    const response = await seasonQueries().getAllSeasons({});
    
    return response;
    }catch(exception: any){
        console.log(exception);
        return "Some error occured";
    }
})
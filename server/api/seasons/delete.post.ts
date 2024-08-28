import seasonQueries from "~/db/DAO/season";
import { IBaseResponse } from "~/interfaces/Response";

export default defineEventHandler(async (request):Promise<IBaseResponse>=>{
    try{
        const body = await readBody(request);
        const seasonId = body.seasonId;
        const queries = seasonQueries();
        const response = await queries.deleteSeason(seasonId);

        setResponseStatus(request  , 200);
        return {
            success:true,
            message:"season delete successfuly"
        }
    }catch(error:any){
        console.log(error);
        setResponseStatus(request , 500);
        return {
            success:true,
            message:"internal server error"
        }
    }
})
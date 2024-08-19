import db from "~/db/db";

export default defineEventHandler(async(request)=>{
    try{
        const result = await db('user').select('*').returning('*');

        console.log(result);

        setResponseStatus(request , 200);
        return result;
    }catch(error:any){
        setResponseStatus(request , 500);

        return {
            "message":"some error on db side"
        }
    }
})
import Ajv, { JSONSchemaType } from "ajv";
import knex from "knex";
import db from "~/db/db";
import { BaseResponse } from "~/interfaces/Response";
import { IUser } from "~/interfaces/user";
import UserSchema from "~/type_schemas/UserSchema";

export default defineEventHandler(async (request):Promise<BaseResponse>=>{
    let response:BaseResponse;
    try{

        const user:IUser = await readBody(request);
        console.log(user);
        const ajv = new Ajv();
        const userSchema:JSONSchemaType<IUser> = UserSchema;
        const validate = ajv.compile(userSchema);

        let display_name = user.user_name;
        if(!validate(user)){
            throw new Error("User must have at least 3 character and at most 20 characters");
        }

        console.log("inserting");
        const [user_id] = await db('user').insert({
            ...user,
            display_name
        }).returning('user_id');

        console.log(user_id);

        response = {
            success:true,
            message:"User is created with user id ",
            status_code:200
        }

    }catch(error : any){
        console.log(error);
        response = {
            success:false,
            message:"error in registering the user",
            status_code:500
        }
    }


    return response;
})
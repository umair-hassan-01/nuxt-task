import Ajv, { JSONSchemaType, ValidateFunction } from "ajv"
import db from "~/db/db";
import { IBaseResponse } from "~/interfaces/Response";
import { IUser } from "~/interfaces/user";
import UserSchema from "~/type_schemas/UserSchema";

function compileSchema(): ValidateFunction<IUser> {
    const ajv = new Ajv();
    const schema: JSONSchemaType<IUser> = UserSchema;
    const validate = ajv.compile(schema);

    return validate;
}

export default defineEventHandler(async (request): Promise<IBaseResponse> => {
    try {
        const requestData: IUser = getQuery(request);

        const validate = compileSchema();

        if (!validate(requestData)){
            console.log("error in validation");
            throw new Error("Invalid input");
        }

        let display_name = requestData.user_name;
        let user_name = requestData.user_name;
        let password = requestData.password;

        const [user_id] = await db('user').insert({
            user_name,
            display_name,
            password
        }).returning('user_id')
        console.log(user_id);
        return {
            success: true,
            message: "user is added with id " + user_id.user_id
        }
    } catch (error: any) {
        setResponseStatus(request, 500);
        console.log("there is some exception");
        console.log(error);
        return {
            success: false,
            message: "error message = " + error.message
        }
    }

})
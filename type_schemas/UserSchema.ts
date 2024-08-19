import Ajv, { type JSONSchemaType } from "ajv";
import type { IUser } from "~/interfaces/user";

const UserSchema: JSONSchemaType<IUser> = {
    "type": "object",
    "properties": {
        "user_name": {
            "type": "string",
            "description": "Login Name",
            "maxLength": 10,
            "minLength": 2
        },
        "password": {
            "type": "string",
            "description": "Login password",
            "minLength": 5,
            "maxLength": 10
        }
    },
    "required": ["user_name", "password"],
    "additionalProperties": false
}

export default UserSchema;
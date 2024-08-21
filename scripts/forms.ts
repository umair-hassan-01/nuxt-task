import { defineComponent, reactive } from "vue";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import {
    defaultStyles,
    mergeStyles,
    vuetifyRenderers,
} from "@jsonforms/vue-vuetify";

import Ajv, { type JSONSchemaType } from "ajv";
import "~/assets/css/loginform.css";
import UserSchema from "~/type_schemas/UserSchema";

// Merge styles if needed
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

const renderers = [
    ...vuetifyRenderers,
    // Add custom renderers if needed
];

const schema = UserSchema;

const uischema = {
    type: "VerticalLayout",
    elements: [
        {
            type: "Control",
            scope: "#/properties/user_name",
        },
        {
            type: "Control",
            scope: "#/properties/password",

        },
    ]
};


const componentSchema = {
    name: "LoginForm",
    components: {
        JsonForms
    },

    setup() {
        const data = reactive({
            user_name: "",
            password: ""
        });

        const onChange = (event: JsonFormsChangeEvent) => {
            Object.assign(data, event.data);
        }

        const handleLogin = async () => {
            console.log("Submit form with user name " + data.user_name);
            const response = await useRequestUtils().getMessage(`/api/helo?user_name=${data.user_name}&password=${data.password}`);
            console.log(response);
        };

        const handleSignUp = async ()=>{
            console.log("register user request");
            const response = await useFetch("/api/auth/register" , {
                method:"POST",
                body:JSON.stringify(data)
            });

            console.log("done with request");
        }

        return {
            data,
            renderers: Object.freeze(renderers),
            schema,
            uischema,
            handleLogin,
            onChange,
            handleSignUp
        }
    }
};

export default componentSchema;

import seasonQueries from "~/db/DAO/season";
import ISeason from "~/interfaces/season/season";
import { Client, WriteStorageObject } from "@heroiclabs/nakama-js"
import { IBaseResponse } from "~/interfaces/Response";

export default defineEventHandler(async (request):Promise<IBaseResponse> => {
    
    // nakama configs ... we'll move these steps to some other place ...
    var useSSL = false; // Enable if server is run with an SSL certificate.
    var client = new Client("defaultkey", "13.60.75.218", "7350", useSSL);
    const deviceId = "9158C14D-BAE4-52F9-8733-418481F701B9";
    const session = await client.authenticateDevice(deviceId, true, "umairhassan");

    try {
        // get the ids of seasons...
        const body = await readBody(request);
        const ids: string[] = body.selected;

        const queries = seasonQueries();
        let seasons: any[] = [];
        let collections = [];

        // get seasons which are selected and not yet pushed to nakama...
        for (let i = 0; i < ids.length; i++) {
            const currentSeason = await queries.getAllSeasons({
                seasonId: ids[i],
                pushToNakama: false
            });

            if (currentSeason.length > 0) {
                seasons.push(currentSeason[0]);

                collections.push({
                    seasonId: currentSeason[0].seasonId,
                    pushToNakama: true
                });
            }
        }

        if(seasons.length < 1){
            return {
                success:true,
                message:"all objects are already pushed to nakama"
            }
        }
        // create storage write objects...
        let writeObjects:WriteStorageObject[] = [];
        for (let index = 0; index < seasons.length; index++) {
            const writeObject: WriteStorageObject = {
                collection: "seasons",
                key: seasons[index].seasonId,
                value: seasons[index]
            };
            writeObjects.push(writeObject);
        }

        // push to nakama..
        const writeResponse = await client.writeStorageObjects(session, writeObjects);

        // mark pushed to nakama as true
        const response = await queries.batchUpdate({ table: 'season', column: 'seasonId' }, collections);

        return {
            success:true,
            message:"pushed to nakama successfuly"
        };

    } catch (error: any) {
        console.log(error);
        return {
            success:false,
            message:'internal server error'
        }
    }
})
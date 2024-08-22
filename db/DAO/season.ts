import knex from "knex"
import db from "../db"
import type IMeta from "~/interfaces/season/meta";

function seasonQueries(){
    interface ISeasonFilter{
        name?:string
        id?:number
    };

    async function getAllSeasons(filter : ISeasonFilter){
        const response = await db.select().from('user');
        return response;
    }

    async function addSeasonMeta(metaData:IMeta){
        try{
            // store meta data in the database... SEASON_META TABLE
            console.log("STORING");
            console.log(metaData);
            const [seasonId] = await db('Season').insert(metaData).returning('*');
            console.log("season id was " + seasonId);
            return seasonId;
        }catch(error:any){
            throw error;
        }
    }

    return {
        getAllSeasons,
        addSeasonMeta
    }
}

export default seasonQueries;


/*
SEASON META
SEASON_VIEW
SEASON_EVENTS
*/
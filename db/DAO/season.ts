import knex, { Knex } from "knex"
import db from "../db"
import type IMeta from "~/interfaces/season/meta";
import type IView from "~/interfaces/season/view";
import type ISeasonEvent from "~/interfaces/season/event";
import type ISeason from "~/interfaces/season/season";
import * as dbconfig from "~/db/tableConfigs.json";
import useHelpers from "~/composables/useHelpers.js";

function seasonQueries() {
    interface ISeasonFilter {
        name?: string
        seasonId?: string
    };

    const tableNames = dbconfig.default.databaseConfigs.tableNames;
    const helper = useHelpers();

    async function getAllSeasons(filter: ISeasonFilter): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = db(`${tableNames.seasonTable}`)
                .leftJoin(`${tableNames.seasonEventsTable} as ev`, `${tableNames.seasonTable}.seasonId`, `=`, `ev.seasonId`)
                .select([
                    `${tableNames.seasonTable}.*`,
                    db.raw(`
                        COALESCE(
                            JSONB_AGG(ev.*), 
                            '[]'::jsonb
                        ) AS events
                    `)
                ]);
    
            // Apply some conditional filters....
            if (filter.seasonId !== undefined) {
                query.where(`${tableNames.seasonTable}.seasonId`, `=`, filter.seasonId);
            }
    
            // Execute the query...
            query.groupBy([`${tableNames.seasonTable}.seasonId`])
                .then(results => {

                    // sanitize some null events... due to left join..
                    results.forEach(result=>{
                        result.events = helper.sanitize(result.events)}
                    );
                    resolve(results);
                })
                .catch(error => {
                    console.log("error occurred");
                    reject(error);
                });
        });
    }
    
    

    function countSeason(filter : ISeasonFilter):Promise<number>{
        return new Promise(async (resolve , reject)=>{
            try{
    
                let query = db(tableNames.seasonTable);
                if(filter.seasonId)
                    query.where('seasonId' , '=' , filter.seasonId);
                query.then(rows=>{
                    resolve(rows.length);
                })

            }catch(error:any){
                reject(error);
            }

        });
    }

    function getSeasonMeta(filter : ISeasonFilter){
        return new Promise((resolve , reject)=>{
            let query = db(tableNames.seasonTable);

            if(filter.seasonId !== undefined)
                query.where('seasonId' , '=' , filter.seasonId);

            query.select('*')
            .then(seasons=>resolve(seasons))
            .then(null , error=>reject(error));
        })
    }

    function getSeasonEvents(filter : ISeasonFilter) {
        return new Promise((resolve , reject)=>{
            let query = db(tableNames.seasonEventsTable);

            if(filter.seasonId !== undefined)
                query.where('seasonId' , '=' , filter.seasonId);

            query.select('*')
            .then(events=>resolve(events))
            .then(null , error=>reject(error));
        })
    }

    // get seasonEvent by seasonId....
    async function getEventById(eventId: string) {
        try {
            const response = await db<ISeasonEvent>(tableNames.seasonEventsTable)
            .select(`*`)
            .where(`eventId`, `=`, eventId);

            return response;
        } catch (error: any) {
            throw error;
        }
    }

    async function updateSeasonEvent(newEvent: ISeasonEvent[] , seasonId:string) {
        try {
            // first remove existing entries...
            const response = await db(tableNames.seasonEventsTable)
            .where('seasonId' , '=' , seasonId)
            .del();

            console.log(`${response} rows deleted`);

            // now insert new data into table using existing function...
            const updatedEvents = await addSeasonEvent(newEvent);
            return updatedEvents;
        } catch (error: any) {
            throw error;
        }
    }

    async function updateSeason(newSeasonData:IMeta){
        try{
            const updatedSeason  = await db(tableNames.seasonTable)
                                    .where('seasonId' , '=' , newSeasonData.seasonId)
                                    .update(newSeasonData)
                                    .returning('*');
            return updatedSeason;
        }catch(error:any){
            throw error;
        }
    }

    async function addSeason(seasonData:IMeta){
        try{
            const response  = await db(tableNames.seasonTable).insert(seasonData).returning('*');
            return response;
        }catch(error:any){
            throw error;
        }
    }

    async function addSeasonEvent(eventData: ISeasonEvent[]) {
        try {
            if(eventData.length === 0)
                return [];
            const createdEvents = await db<ISeasonEvent>(tableNames.seasonEventsTable)
            .insert(eventData)
            .returning(`*`);

            return createdEvents;
        } catch (error: any) {
            throw error;
        }
    }

    return {
        getAllSeasons,
        addSeasonEvent,
        getSeasonMeta,
        getSeasonEvents,
        updateSeasonEvent,
        getEventById,
        addSeason,
        countSeason,
        updateSeason
    }
}

export default seasonQueries;


/*
SEASON META
SEASON_VIEW
SEASON_EVENTS
*/
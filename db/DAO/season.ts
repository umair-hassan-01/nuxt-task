import knex, { Knex } from "knex"
import db from "../db"
import type IMeta from "~/interfaces/season/meta";
import type IView from "~/interfaces/season/view";
import type ISeasonEvent from "~/interfaces/season/event";
import type ISeason from "~/interfaces/season/season";
import * as dbconfig from "~/db/tableConfigs.json";
import useHelpers from "~/composables/useHelpers.js";
import type IPaginationFilter from "~/interfaces/season/filters";

function seasonQueries() {
    interface ISeasonFilter {
        name?: string
        seasonId?: string
        pushToNakama?: boolean
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

            if (filter.pushToNakama !== undefined) {
                query.where(`${tableNames.seasonTable}.pushToNakama`, '=', filter.pushToNakama);
            }

            // Execute the query...
            query.groupBy([`${tableNames.seasonTable}.seasonId`])
                .then(results => {

                    // sanitize some null events... due to left join..
                    results.forEach(result => {
                        result.events = helper.sanitize(result.events)
                    }
                    );
                    resolve(results);
                })
                .catch(error => {
                    console.log("error occurred");
                    reject(error);
                });
        });
    }



    function countSeason(filter: ISeasonFilter): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {

                let query = db(tableNames.seasonTable);
                if (filter.seasonId)
                    query.where('seasonId', '=', filter.seasonId);
                query.then(rows => {
                    resolve(rows.length);
                })

            } catch (error: any) {
                reject(error);
            }

        });
    }

    function getSeasonMeta(filter: ISeasonFilter) {
        return new Promise((resolve, reject) => {
            let query = db(tableNames.seasonTable);

            if (filter.seasonId !== undefined)
                query.where('seasonId', '=', filter.seasonId);

            query.select('*')
                .then(seasons => resolve(seasons))
                .then(null, error => reject(error));
        })
    }

    function getSeasonEvents(filter: ISeasonFilter) {
        return new Promise((resolve, reject) => {
            let query = db(tableNames.seasonEventsTable);

            if (filter.seasonId !== undefined)
                query.where('seasonId', '=', filter.seasonId);

            query.select('*')
                .then(events => resolve(events))
                .then(null, error => reject(error));
        })
    }

    // simplified version of season to be displayed on index page....
    function getSimpleSeason(filter:ISeasonFilter , paginationFilter ?: IPaginationFilter){
        return new Promise(async (resolve, reject) => {

            try{

                let query = db.from(tableNames.seasonTable);

                if(filter.seasonId !== undefined)
                    query.where('seasonId' , '=' , filter.seasonId);

                // apply pagination filter
                if(paginationFilter){
                    query.where('seasonNumber' , paginationFilter.isDesc ? '<' : '>' , paginationFilter.isDesc ? paginationFilter.lastSmallItemNumber : paginationFilter.lastLargeItemNumber);
                    query.where('seasonTitle','like' , `%${paginationFilter.search}%`);
                    query.limit(paginationFilter.itemsPerPage);
                }

                query.select(
                    '*',
                    db(tableNames.seasonEventsTable)
                        .count('*')
                        .whereRaw('?? = ??', [`${tableNames.seasonEventsTable}.seasonId`, `${tableNames.seasonTable}.seasonId`])
                        .as('events')

                );

                query.orderBy('seasonNumber' , paginationFilter?.isDesc ? 'desc' : 'asc').then(seasons => resolve(seasons))
                    .then(null , error => reject(error));

            }catch(error:any){
                reject(error);
            }

        });
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

    async function updateSeasonEvent(newEvent: ISeasonEvent[], seasonId: string) {
        try {
            // first remove existing entries...
            const response = await db(tableNames.seasonEventsTable)
                .where('seasonId', '=', seasonId)
                .del();

            console.log(`${response} rows deleted`);

            // now insert new data into table using existing function...
            const updatedEvents = await addSeasonEvent(newEvent);
            return updatedEvents;
        } catch (error: any) {
            throw error;
        }
    }

    async function updateSeason(newSeasonData: IMeta) {
        try {
            const updatedSeason = await db(tableNames.seasonTable)
                .where('seasonId', '=', newSeasonData.seasonId)
                .update(newSeasonData)
                .returning('*');
            return updatedSeason;
        } catch (error: any) {
            throw error;
        }
    }

    async function addSeason(seasonData: IMeta) {
        try {
            const response = await db(tableNames.seasonTable).insert(seasonData).returning('*');
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    async function addSeasonEvent(eventData: ISeasonEvent[]) {
        try {
            if (eventData.length === 0)
                return [];
            const createdEvents = await db<ISeasonEvent>(tableNames.seasonEventsTable)
                .insert(eventData)
                .returning(`*`);

            return createdEvents;
        } catch (error: any) {
            throw error;
        }
    }

    const batchUpdate = async (options: { table: string, column: string }, collection: any[]) => {
        try {
            const { table, column } = options;

            const trx = await db.transaction();
            try {
                await Promise.all(collection.map(tuple =>
                    db(table)
                        .where(column, tuple[column])
                        .update(tuple)
                        .transacting(trx)
                )
                );
                await trx.commit().returning('*');
            } catch (error) {
                await trx.rollback();
            }
        } catch (error: any) {
            throw error;
        }
    }


    async function deleteSeason(seasonId:string){
        try{
            // first delete from seasonTable
            const seasonDel = await db(tableNames.seasonTable).where('seasonId','=',seasonId).del();
            // now perform cascade delete on events table
            const eventsDel = await db(tableNames.seasonEventsTable)
                                    .where('seasonId' , '=' , seasonId)
                                    .del();
            
            return [seasonDel , eventsDel];
        }catch(error:any){
            throw error;
        }
    }

    function countRows(tableName:string , search:string){
        return new Promise((resolve , reject)=>{
            let query = db(tableName).count('*');
            query.where('seasonTitle' , 'like' , `%${search}%`);
            query.then(count=>resolve(count.length > 0 ? count[0].count : 0))
                .catch(error=>reject(error));
        });
    }

    return {
        getAllSeasons,
        addSeasonEvent,
        getSeasonMeta,
        getSeasonEvents,
        getSimpleSeason,
        updateSeasonEvent,
        getEventById,
        addSeason,
        countSeason,
        updateSeason,
        batchUpdate,
        deleteSeason,
        countRows
    }
}

export default seasonQueries;


/*
SEASON META ->table name is season
SEASON_EVENTS -> table name is SEASON_EVENT
*/
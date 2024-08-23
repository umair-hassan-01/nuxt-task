import knex from "knex"
import db from "../db"
import type IMeta from "~/interfaces/season/meta";
import type IView from "~/interfaces/season/view";
import type ISeasonEvent from "~/interfaces/season/event";

function seasonQueries(){
    interface ISeasonFilter{
        name?:string
        id?:number
    };

    async function getAllSeasons(filter : ISeasonFilter){
        const response = await (
            db
            .select('*')
            .from('Season')
            .join('SEASON_VIEW' , 'Season.seasonId' , '=' , 'SEASON_VIEW.seasonId')
            .join('SEASON_EVENT' , 'Season.seasonId', '=','SEASON_VIEW.seasonId')
        )
        return response;
    }

    async function getSeasonEvents(seasonId:string | undefined){
        try{
            let events:ISeasonEvent[] = [];
            if(seasonId)
                events = await db<ISeasonEvent>('SEASON_EVENT').select().where('seasonId','=',seasonId);
            else 
                events = await db<ISeasonEvent>('SEASON_EVENT').select();
            return events;
        }catch(error:any){
            throw error;
        }
    }

    async function getSeasonView(seasonId:string | undefined){
        try{
            let view:IView[] = [];
            if(seasonId)
                view = await db<IView>('SEASON_VIEW').select().where('SEASON_VIEW.seasonId','=',seasonId);
            else
                view = await db<IView>('SEASON_VIEW').select();
            return view;
        }catch(error : any){
            throw error;
        }
    }

    async function getSeasonMeta(seasonId:string | undefined){
        try{
            let meta:IMeta[] = [];
            if(seasonId)
                meta = await db('Season').select().where('seasonId' , '=',seasonId);
            else
                meta = await db('Season').select();
            return meta;
        }catch(error:any){
            throw error;
        }
    }
    async function addSeasonMeta(metaData:IMeta[]){
        try{
            // store meta data in the database... SEASON_META TABLE
            console.log("STORING");
            console.log(metaData);
            const newMeta = await db<IMeta>('Season').insert(metaData).returning('*');
            return newMeta;

        }catch(error:any){
            throw error;
        }
    }

    async function addSeasonView(viewData:IView[]){
        try{
            // store view data in postgress data .... table -> SEASON_VIEW
            const newView  = await db<IView>('SEASON_VIEW').insert(viewData).returning('*');
            return newView;
        }catch(error:any){
            throw error;
        }
    }

    async function addSeasonEvent(eventData:ISeasonEvent[]){
        try{
            const response = await db<ISeasonEvent>('SEASON_EVENT').insert(eventData).returning('*');
            return response;
        }catch(error:any){
            throw error;
        }
    }

    return {
        getAllSeasons,
        addSeasonMeta,
        addSeasonView,
        addSeasonEvent,
        getSeasonEvents,
        getSeasonView,
        getSeasonMeta
    }
}

export default seasonQueries;


/*
SEASON META
SEASON_VIEW
SEASON_EVENTS
*/
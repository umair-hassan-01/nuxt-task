import type ISeasonEvent from "~/interfaces/season/event";
import type IMeta from "~/interfaces/season/meta";
import type ISeason from "~/interfaces/season/season";
import type IView from "~/interfaces/season/view";

export default function useDefaults(){
    function getDefaultSeason():ISeason{
        const currentUUId = crypto.randomUUID();
        let metaData: IMeta = {
            seasonId: currentUUId,
            seasonNumber: 1,
            seasonTitle: "",
            theme: 1,
            startTime: "2022-06-15T13:15:00+05:00",
            endTime: "2022-06-15T13:15:00+05:00",
            ballColor: "white",
            clubUrl: "localhost",
            backgroundBlurUrl: "localhost",
            backgroundUrl: "localhost",
            description: "dummy",
            buttonText: "white",
            iconUrl:"https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg",
            pushToNakama:false
        };
        
        let eventsData: ISeasonEvent[] = [];

        let seasonData = {
            metaData:metaData,
            eventsData:eventsData
        }

        return seasonData;
    }

    function getDefaultEvent():ISeasonEvent{
        let event:ISeasonEvent = {
            eventId: crypto.randomUUID(),
            title: 'dummy title',
            eventType: 'weekly',
            startTime: '2022-06-15T13:15:00+05:00',
            endTime: '2022-06-15T13:15:00+05:00',
            qualifierDuration: 0,
            tournamentDuration: 0,
            tickets: 0,
            prizePool: 0
        };

        return event;
    }

    return {
        getDefaultSeason,
        getDefaultEvent
    }
}
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
            buttonText: "white"
        };
        
        let eventsData: ISeasonEvent[] = [];

        let seasonData = {
            metaData:metaData,
            eventsData:eventsData
        }

        return seasonData;
    }

    return {
        getDefaultSeason
    }
}
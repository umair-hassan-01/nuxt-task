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
            startTime: "",
            endTime: ""
        };
        
        let viewData: IView = {
            seasonId: currentUUId,
            seasonNumber: 1,
            seasonTitle: "",
            ballColor: "",
            clubUrl: "",
            backgroundBlurUrl: "",
            backgroundUrl: "",
            description: "",
            buttonText: ""
        };
        
        let eventsData: ISeasonEvent[] = [];

        let seasonData = {
            metaData:metaData,
            viewData:viewData,
            eventsData:eventsData
        }

        return seasonData;
    }

    return {
        getDefaultSeason
    }
}
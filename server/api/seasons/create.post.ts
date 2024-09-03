import useSeasonValidators from "~/composables/useSeasonValidators";
import seasonQueries from "~/db/DAO/season";
import { IBaseResponse, ICreateSeasonResponse } from "~/interfaces/Response";
import ISeasonEvent from "~/interfaces/season/event";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";
import useHelpers from "~/composables/useHelpers";
import IView from "~/interfaces/season/view";
import moment from "moment";


async function handleUpdate(seasonMeta: IMeta, events: ISeasonEvent[]): Promise<ISeason> {
    console.log("UPDATE VALS");
    const queries = seasonQueries();
    const updatedSeason = await queries.updateSeason(seasonMeta);
    const updatedEvents = await queries.updateSeasonEvent(events , seasonMeta.seasonId);

    return {
        metaData: updatedSeason[0],
        eventsData: updatedEvents
    }
}

export default defineEventHandler(async (event): Promise<ICreateSeasonResponse> => {
    try {
        const seasonData = (await readBody(event)) as unknown as ISeason;
        const queries = seasonQueries();
        const helpers = useHelpers();

        let response: ICreateSeasonResponse;

        // need to validate the data first...
        const seasonValidator = useSeasonValidators();
        const metaDataValidation = seasonValidator.validateMeta(seasonData.metaData);
        const eventsDataValidation = seasonValidator.validateSeasonEvents(seasonData.eventsData,seasonData.metaData);

        let customErrorMessage = eventsDataValidation.errors;
        if(!metaDataValidation.valid)
            customErrorMessage = metaDataValidation.errors;

        if (customErrorMessage.length > 0) {
            return response = {
                success: false,
                message: customErrorMessage,
                season: null
            }
        }

        const meta = seasonData.metaData;
        delete meta.seasonNumber;

        // delete updatedAt in events to let postgress add that time stamp
        seasonData.eventsData.forEach(event=>{
            if(event.updated_at)
                delete  event.updated_at;
            if(event.created_at)
                delete event.created_at;
        });

        // convert datetime to epoch time stamps
        meta.startTime = helpers.dateTimeToEpoch(meta.startTime);
        meta.endTime = helpers.dateTimeToEpoch(meta.endTime);

        seasonData.eventsData.forEach(event=>{
            event.startTime = helpers.dateTimeToEpoch(event.startTime);
            event.endTime = helpers.dateTimeToEpoch(event.endTime);
        })

        meta.pushToNakama = false;

        let existingCount = await queries.countSeason({
            seasonId: meta.seasonId
        });

        let events = seasonData.eventsData;
        events.forEach(event => event.seasonId = meta.seasonId);

        let season: ISeason;
        if (existingCount > 0) {
            season = await handleUpdate(meta, seasonData.eventsData);
        } else {
            const createdSeason = await queries.addSeason(meta);
            const createdEvents = await queries.addSeasonEvent(events);
            season = {
                metaData: createdSeason[0],
                eventsData: createdEvents
            }
        }


        return response = {
            success: true,
            message: "user created successfuly",
            season: season
        }

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
            season: null
        }
    }
})
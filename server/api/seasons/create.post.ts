import useSeasonValidators from "~/composables/useSeasonValidators";
import seasonQueries from "~/db/DAO/season";
import { IBaseResponse, ICreateSeasonResponse } from "~/interfaces/Response";
import ISeasonEvent from "~/interfaces/season/event";
import IMeta from "~/interfaces/season/meta";
import ISeason from "~/interfaces/season/season";
import IView from "~/interfaces/season/view";


async function handleUpdate(seasonMeta: IMeta, events: ISeasonEvent[]): Promise<ISeason> {
    const queries = seasonQueries();
    const updatedSeason = await queries.updateSeason(seasonMeta);
    const updatedEvents = await queries.updateSeasonEvent(events, seasonMeta.seasonId);
    return {
        metaData: updatedSeason[0],
        eventsData: updatedEvents
    }
}

export default defineEventHandler(async (event): Promise<ICreateSeasonResponse> => {
    try {
        const seasonData = (await readBody(event)) as unknown as ISeason;
        const queries = seasonQueries();

        let response: ICreateSeasonResponse;
        // need to validate the data first...
        const seasonValidator = useSeasonValidators();
        let customErrorMessage = "";
        if (!seasonValidator.validateSeasonMeta(seasonData.metaData)) {
            customErrorMessage = "META NOT VALIDATED";
        }
        let eventValidation = seasonValidator.validateSeasonEvents(seasonData.eventsData);
        if (!eventValidation.valid)
            customErrorMessage = `EVENT NUMBER ${eventValidation.index} IS NOT VALIDATED`;

        if (customErrorMessage.length > 0) {
            return response = {
                success: false,
                message: customErrorMessage,
                season: null
            }
        }

        const meta = seasonData.metaData;
        delete meta.seasonNumber;

        let existingCount = await queries.countSeason({
            seasonId: meta.seasonId
        });
        let events = seasonData.eventsData;
        events.forEach(event => event.seasonId = meta.seasonId);

        console.log('existing count is ' + existingCount);
        let season: ISeason;
        if (existingCount > 0) {
            console.log("perform update");
            season = await handleUpdate(meta, seasonData.eventsData);
        } else {
            console.log("EVENts were ");
            console.log(events);
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
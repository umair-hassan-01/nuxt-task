import type ISeasonEvent from "./event";
import type IMeta from "./meta";
import type IView from "./view";

export default interface ISeason{
    metaData:IMeta
    viewData:IView
    eventData:ISeasonEvent[]
}
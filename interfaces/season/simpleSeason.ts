// seasonId:"1",
// logo:'https://i.pinimg.com/564x/2a/35/d9/2a35d95e6861fa2cc4b991d9417f8b68.jpg',
// title: 'Pre Winter Games',
// date:"7 Aug 2024",
// nakama_push:false,
// events:2,
// theme:4,
// updated_at:"2024 Aug 29 10:00 AM",
import type IMeta from "~/interfaces/season/meta";

export default interface ISimplifiedSeason extends IMeta{
    events:number
}
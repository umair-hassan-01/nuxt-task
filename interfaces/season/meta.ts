/*
    "seasonId": "6429c5af-2721-4b68-8930-e1f7a771554f",
    "seasonNumber": 5,
    "seasonTitle": "winter games new ",
    "theme": 1,
    "startTime": "2024-08-23T15:06:00.000Z",
    "endTime": "2024-08-23T15:06:00.000Z",
    "backgroundUrl": "127:10:99",
    "backgroundBlurUrl": "red",
    "buttonText": "whitec",
    "description": "this is winter games season",
    "ballColor": "white",
    "clubUrl": "localhost",
    "created_at": "2024-08-23T10:10:27.748Z",
    "updated_at": "2024-08-23T10:10:27.748Z",
*/

export default interface IMeta{
    seasonNumber?:number
    seasonId:string
    seasonTitle:string
    theme:number
    startTime:string
    endTime:string
    backgroundUrl:string
    backgroundBlurUrl:string
    buttonText:string
    description:string
    ballColor:string
    clubUrl:string
    updated_at?:string
    created_at?:string
}
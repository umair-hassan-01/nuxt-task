export default interface ISeasonEvent {

    eventId: string;
    seasonId?:string;
    title: string;
    eventType: "daily" | "weekly" | "monthly";
    startTime: string;
    endTime: string;
    qualifierDuration: number;
    tournamentDuration: number;
    tickets: number;
    prizePool: number;
    created_at?:string;
    updated_at?:string;
}
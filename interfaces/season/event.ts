export default interface ISeasonEvent {

    id: number;
    title: string;
    eventType: "daily" | "weekly" | "monthly";
    startTime: string;
    endTime: string;
    qualifierDuration: number;
    tournamentDuration: number;
    tickets: number;
    prizePool: number;
}
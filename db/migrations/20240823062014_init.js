/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
/*
interface ISeasonEvent {

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
}
*/
export function up(knex) {
  return (knex.schema.createTable('SEASON_EVENT' , table=>{
    table.uuid('eventId').primary();
    table.uuid('seasonId');
    table.string('title' , 100);
    table.string('eventType' , 30);
    table.date('startTime');
    table.date('endTime');
    table.integer('qualifierDuration');
    table.integer('tournamentDuration');
    table.integer('tickets');
    table.integer('prizePool');
    table.timestamps(true , true);
  }));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return (knex.schema.dropTable('SEASON_EVENT'));
}

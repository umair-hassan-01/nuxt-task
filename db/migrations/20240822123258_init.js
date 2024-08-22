/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/*
interface IMeta{
    seasonNumber:number
    seasonId:number
    seasonTitle:string
    theme:number
    startTime:string
    endTime:string
}

*/
export function up(knex) {
  return (knex.schema.createTable('Season' , table=>{
    table.uuid('seasonId').primary();
    table.increments('seasonNumber');
    table.string('seasonTitle' , 300);
    table.integer('theme');
    table.string('startTime' , 60);
    table.string('endTime' , 60);

    table.unique(['seasonId' , 'seasonNumber']);
  }));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('Season');
}

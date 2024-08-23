/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
/*
interface IView{
    seasonNumber:number
    seasonId:number
    seasonTitle:string
    backgroundUrl:string
    backgroundBlurUrl:string
    buttonText:string
    description:string
    ballColor:string
    clubUrl:string
}
*/
export function up(knex) {
  return (knex.schema.createTable('SEASON_VIEW' , table=>{
    table.uuid('seasonId');
    table.integer('seasonNumber');
    table.string('seasonTitle' , 300);
    table.string('backgroundUrl' , 100);
    table.string('backgroundBlurUrl' , 100);
    table.string('buttonText' , 30);
    table.string('description' , 300);
    table.string('ballColor' , 30);
    table.string('clubUrl' , 100);
    table.timestamps(true , true);
  }));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return (knex.schema.dropTable('SEASON_VIEW'));
}

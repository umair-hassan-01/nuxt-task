/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/*
interface IMeta{
  seasonId: '6429c5af-2721-4b68-8930-e1f7a771551f',
  seasonNumber: 1,
  seasonTitle: 'winter games',
  theme: 1,
  startTime: '2024-08-23T15:06:00.000Z',
  endTime: '2024-08-23T15:06:00.000Z',
  created_at: '2024-08-23T10:10:27.748Z',
  updated_at: '2024-08-23T10:10:27.748Z',
  backgroundUrl: '127:10:99',
  backgroundBlurUrl: 'red',
  buttonText: 'whitec',
  description: 'this is winter games season',
  ballColor: 'white',
  clubUrl: 'localhost' }
}

*/
export function up(knex) {
  return (knex.schema.createTable('season' , table=>{
    table.uuid('seasonId').primary();
    table.increments('seasonNumber');
    table.string('seasonTitle' , 300);
    table.integer('theme');
    table.bigint('startTime');
    table.bigint('endTime');
    table.string('backgroundUrl' , 100);
    table.string('backgroundBlurUrl' , 100);
    table.string('buttonText' , 30);
    table.string('description' , 300);
    table.string('ballColor' , 30);
    table.string('clubUrl' , 100);

    table.timestamps(true , true);
    table.unique(['seasonId' , 'seasonNumber']);
  }));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('season');
}

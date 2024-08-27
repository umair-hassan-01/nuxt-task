/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (knex.schema.alterTable('season' , table=>{
    table.boolean('pushToNakama').defaultTo(false);
  }))
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return (knex.schema.alterTable('season' , table=>{
    table.dropColumn('pushToNakama');
  }))
}

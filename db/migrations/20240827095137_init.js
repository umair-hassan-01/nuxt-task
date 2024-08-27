/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (knex.schema.alterTable('season' , table=>{
    table.string("iconUrl" , 300);
  }));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return (knex.schema.alterTable('season' , table=>{
    table.dropColumn('iconUrl');
  }))
}

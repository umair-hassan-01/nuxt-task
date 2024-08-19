/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (knex.schema.alterTable('user' , table=>{
    table.string('password' , 100);
  }))
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('user' , table=>{
    table.dropColumn('password');
  })
}

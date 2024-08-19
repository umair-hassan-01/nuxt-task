/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return (knex.schema.createTable('user' , table=>{
      table.increments('user_id');
      table.string('user_name' , 30).notNullable().unique();
      table.string('display_name' , 30).notNullable();
    }).createTable('post' , table=>{
      table.increments('post_id');
      table.string('post_title' , 40).notNullable();
      table.string('post_body' , 300).notNullable();
    }))
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable('user').dropTable('post');
  }

import knex from "knex";
import knexfile from "~/db/knexfile.js";

const db = knex(knexfile.development);

export default db;



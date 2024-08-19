// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export default  {
  development: {
    client: 'postgresql',
    connection: {
      database: 'testingdb',
      user: 'postgres',
      password: "",
      port:5400
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};

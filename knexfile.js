// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database:'get_bit'
    },
    migrations:{
      directory: './migrations'
    },
    seeds:{
      directory: './seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host:     process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      user:     process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port:     process.env.DATABASE_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }

};

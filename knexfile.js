require('dotenv').config();

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host:     process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      user:     process.env.DATABASE_USER,
      password: process.env.ORACLEDBPW,
      port:     process.env.DATABASE_PORT
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
    client: 'mysql',
    connection: {
      host:     process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      user:     process.env.DATABASE_USER,
      password: process.env.ORACLEDBPW,
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

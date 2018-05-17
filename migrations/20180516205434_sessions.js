
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('sessions', (table) => {
    table.string('session_id').notNullable();
    table.integer('user_id').references('users.id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('sessions');
};

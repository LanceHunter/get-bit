
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('labels', function(table){
    table.increments('label_id');
    table.integer('user_id');
    table.string('label').notNullable();

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('labels');
};

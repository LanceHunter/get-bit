
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('jokes_performances', function(table){
    table.integer('joke_id');
    table.integer('per_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes_performances');
};

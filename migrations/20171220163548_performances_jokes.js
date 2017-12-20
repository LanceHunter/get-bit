
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('jokes_performances', function(table){
    table.integer('joke_id').references('jokes.joke_id').onDelete('cascade');
    table.integer('per_id').references('performances.per_id').onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes_performances');
};

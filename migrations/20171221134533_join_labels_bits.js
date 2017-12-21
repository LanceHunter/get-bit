
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('jokes_labels', function(table){
    table.integer('joke_id').references('jokes.joke_id').onDelete('cascade');
    table.integer('label_id').references('labels.label_id').onDelete('cascade');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes_labels');
};

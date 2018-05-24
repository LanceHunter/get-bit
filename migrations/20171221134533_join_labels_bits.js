
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('jokes_labels', function(table){
    table.integer('joke_id');
    table.integer('label_id');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes_labels');
};

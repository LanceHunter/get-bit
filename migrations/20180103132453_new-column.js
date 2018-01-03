
exports.up = function(knex, Promise) {
  return knex.schema.table('jokes_performances', table =>{
    table.boolean('performed').defaultTo(true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes_performances');
};

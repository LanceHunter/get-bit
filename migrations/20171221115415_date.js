
exports.up = function(knex, Promise) {
  return knex.schema.table('performances', table =>{
    table.timestamp('date').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('performances');
};


exports.up = function(knex, Promise) {
  return knex.schema.table('jokes', table =>{
    table.integer('label_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes');
};

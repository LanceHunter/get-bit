
exports.up = function(knex, Promise) {
  return knex.schema.table('jokes', table =>{
    table.integer('label_id').references('labels.label_id').onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes');
};


exports.up = function(knex, Promise) {
  return knex.schema.table('users', table =>{
    table.string('photo_url');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};

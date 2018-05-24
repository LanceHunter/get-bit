
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('joke_body', function(table){
    table.integer('joke_id');
    table.text('body').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  }).then(function(){
    return knex.schema.createTableIfNotExists('tags', function(table){
      table.integer('joke_id');
      table.string('tag')
    })
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('joke_body').then(function(){
    return knex.schema.dropTableIfExists('tags')
  })
};

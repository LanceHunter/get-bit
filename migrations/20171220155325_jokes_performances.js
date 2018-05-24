
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('jokes', function(table){
    table.increments('joke_id');
    table.integer('user_id');
    table.string('joke_title').notNullable();
  }).then(function(){
    return knex.schema.createTableIfNotExists('performances', function(table){
      table.increments('per_id');
      table.integer('user_id');
      table.string('per_title').notNullable();
      table.string('location');
      table.integer('given_time').notNullable();
      table.integer('per_time').notNullable();
      table.string('audio');
      table.integer('rating');
    })
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('jokes')
  .then(function(){
    return knex.schema.dropTableIfExists('performances')
  })
};

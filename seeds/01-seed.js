let lance = {
  user_name : 'lance@lance.com',
  password : '$2a$10$fa.V3LnXYMzXv23lOT8N0.5qfiZvh/DdrruGa.tLG0KRhJ1iWWan6',
  bit1 : {
    joke_title : 'Farts getting faster'
  },
  bit2 : {
    joke_title : 'Forgetting how to type'
  },
  bit3 : {
    joke_title : 'Tech bros'
  },

};

let paige = {
  user_name : 'paige@paige.com',
  password : '$2a$10$tPGtiaeUMPb0Fco4XvMsMukW81T0dT4HVPkkp.s/HfZB9lAv4bZVy',
  bit1 : {
    joke_title : 'Baseball canoe'
  },
  bit2 : {
    joke_title : 'Top five explosions of 2017'
  },
  bit3 : {
    joke_title : 'Restaurants are everywhere'
  },
  bit4 : {
    joke_title : 'The story about that time I did that thing'
  },

};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('jokes_labels').del()
    .then(() => {
      return knex('labels').del();
    })
    .then(() => {
      return knex('jokes_performances').del();
    })
    .then(() => {
      return knex('joke_body').del();
    })
    .then(() => {
      return knex('tags').del();
    })
    .then(() => {
      return knex('performances').del();
    })
    .then(() => {
      return knex('jokes').del();
    })
    .then(() => {
      return knex('users').del();
    })
    .then(() => {
      return knex('users').returning('id').insert([
        { user_name : lance.user_name,
          password : lance.password },
        { user_name : paige.user_name,
          password : paige.password },
      ]);
    })
    .then((userIDs) => {
      lance.user_id = userIDs[0];
      paige.user_id = userIDs[1];
      console.log('lance.user_id - ', lance.user_id, ' || paige.user_id - ', paige.user_id );
      let labelsInsertArr = [
        {'user_id' : lance.user_id,
         'label' : 'new'},
        {'user_id' : lance.user_id,
         'label' : 'good'},
        {'user_id' : lance.user_id,
         'label' : 'closer'},
         {'user_id' : paige.user_id,
          'label' : 'new'},
         {'user_id' : paige.user_id,
          'label' : 'good'},
         {'user_id' : paige.user_id,
          'label' : 'closer'},
      ];
      return knex('labels').returning('label_id').insert(labelsInsertArr);
    })
    .then((labelIDs) => {
      console.log('The label IDs - ', labelIDs);
      lance.bit1.label_id = labelIDs[0];
      lance.bit3.label_id = labelIDs[2];
      paige.bit2.label_id = labelIDs[4];
      let jokeInsertArr = [
        { joke_title : lance.bit1.joke_title,
          label_id : lance.bit1.label_id,
          user_id : lance.user_id
        },
        { joke_title : lance.bit2.joke_title,
          user_id : lance.user_id
        },
        { joke_title : lance.bit3.joke_title,
          label_id : lance.bit3.label_id,
          user_id : lance.user_id
        },
        { joke_title : paige.bit1.joke_title,
          user_id : paige.user_id
        },
        { joke_title : paige.bit2.joke_title,
          label_id : paige.bit2.label_id,
          user_id : paige.user_id
        },
        { joke_title : paige.bit3.joke_title,
          user_id : paige.user_id
        },
        { joke_title : paige.bit4.joke_title,
          user_id : paige.user_id
        }
      ];
      return knex('jokes').returning('joke_id').insert(jokeInsertArr);
    })
    .then((jokeIDs) => {
      console.log('The joke IDs - ', jokeIDs);
      lance.bit1.joke_id = jokeIDs[0];
      lance.bit2.joke_id = jokeIDs[1];
      lance.bit3.joke_id = jokeIDs[2];
      paige.bit1.joke_id = jokeIDs[3];
      paige.bit2.joke_id = jokeIDs[4];
      paige.bit3.joke_id = jokeIDs[5];
      paige.bit4.joke_id = jokeIDs[6];
    })
};

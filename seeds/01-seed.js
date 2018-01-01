let lance = {
  user_name : 'lance@lance.com',
  password : '$2a$10$fa.V3LnXYMzXv23lOT8N0.5qfiZvh/DdrruGa.tLG0KRhJ1iWWan6',
  bit1 : {
    joke_title : 'Farts getting faster',
    body : [
      { body : `This is the first body of bit 1`,
        created_at : '2018-01-01 12:36:21.379288-06'
      },
      { body : `This is the second body of bit 1`,
        created_at : '2018-01-01 12:37:14.34731-06'
      },
      { body : `This is the third body of bit 1`,
        created_at : '2018-01-01 12:37:23.690095-06'
      }
    ]
  },
  bit2 : {
    joke_title : 'Forgetting how to type',
    body : [
      { body : `This is the first body of bit 2`,
        created_at : '2018-01-01 12:16:21.379288-06'
      },
      { body : `This is the second body of bit 2`,
        created_at : '2018-01-01 12:38:12.236263-06'
      }
    ]
  },
  bit3 : {
    joke_title : 'Tech bros',
    body : [
      { body : `This is the first body of bit 3`,
        created_at : '2018-01-01 12:39:44.434804-06'
      }
    ]
  },
  performances : [
    {
      per_title : 'Laugh Out Proud',
      location : 'Institution Theatre',
      given_time : 420,
      per_time : 400,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 4,
      date : '2018-01-01 13:46:23.405289-06'
    },
    {
      per_title : 'Laugh Out Proud',
      location : 'Institution Theatre',
      given_time : 420,
      per_time : 415,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 2,
      date : '2018-12-05 13:46:23.405289-06'
    },
    {
      per_title : 'Laugh Out Proud',
      location : 'Institution Theatre',
      given_time : 420,
      per_time : 435,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 4,
      date : '2017-12-01 13:46:23.405289-06'
    }
  ]
};

let paige = {
  user_name : 'paige@paige.com',
  password : '$2a$10$tPGtiaeUMPb0Fco4XvMsMukW81T0dT4HVPkkp.s/HfZB9lAv4bZVy',
  bit1 : {
    joke_title : 'Baseball canoe',
    body : [
      { body : `This is the first body of bit 1`,
        created_at : '2018-01-01 12:36:21.379288-06'
      },
      { body : `This is the second body of bit 1`,
        created_at : '2018-01-01 12:37:14.34731-06'
      },
      { body : `This is the third body of bit 1`,
        created_at : '2018-01-01 12:37:23.690095-06'
      }
    ]
  },
  bit2 : {
    joke_title : 'Top five explosions of 2017',
    body : [
      { body : `This is the first body of bit 2`,
        created_at : '2018-01-01 12:36:21.379288-06'
      },
      { body : `This is the second body of bit 2`,
        created_at : '2018-01-01 12:37:14.34731-06'
      },
      { body : `This is the third body of bit 2`,
        created_at : '2018-01-01 12:37:23.690095-06'
      }
    ]
  },
  bit3 : {
    joke_title : 'Restaurants are everywhere',
    body : [
      { body : `This is the first body of bit 3`,
        created_at : '2018-01-01 12:36:21.379288-06'
      }
    ]
  },
  bit4 : {
    joke_title : 'The story about that time I did that thing',
    body : [
      { body : `This is the first body of bit 4`,
        created_at : '2018-01-01 12:36:21.379288-06'
      }
    ]
  },
  performances : [
    {
      per_title : 'Reordered Mic',
      location : 'Kick Butt Coffee',
      given_time : 300,
      per_time : 290,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 2,
      date : '2018-01-01 13:46:23.405289-06'
    },
    {
      per_title : 'FPIA',
      location : 'Cap City Comedy Club',
      given_time : 300,
      per_time : 295,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 4,
      date : '2018-12-05 13:46:23.405289-06'
    },
    {
      per_title : 'Stories from the Edge',
      location : 'Spiderhouse Ballroom',
      given_time : 900,
      per_time : 899,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 5,
      date : '2017-12-01 13:46:23.405289-06'
    },
    {
      per_title : 'Coldtowne Open Mic',
      location : 'Coldtowne Theatre',
      given_time : 300,
      per_time : 280,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 4,
      date : '2017-10-01 13:46:23.405289-06'
    },
    {
      per_title : 'Speed Mic',
      location : 'The Velv',
      given_time : 300,
      per_time : 290,
      audio : 'http://lancehunter.net/example/test-audio.flac',
      rating : 4,
      date : '2017-11-01 13:46:23.405289-06'
    }
  ]

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
      let jokeBodyInsertArr = [];
      lance.bit1.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : lance.bit1.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      lance.bit2.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : lance.bit2.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      lance.bit3.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : lance.bit3.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      paige.bit1.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : paige.bit1.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      paige.bit2.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : paige.bit2.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      paige.bit3.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : paige.bit3.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      paige.bit4.body.forEach((bitBody) => {
        jokeBodyInsertArr.push({
          joke_id : paige.bit4.joke_id,
          body : bitBody.body,
          created_at : bitBody.created_at
        });
      });
      return knex('joke_body').insert(jokeBodyInsertArr);
    });
};

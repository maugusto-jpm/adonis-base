/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Env = use('Env');
const { randomBytes } = require('crypto');

const moment = use('moment');

Factory.blueprint('App/Models/User', (chance, i, data = {}) => ({
  name: chance.name(),
  email: chance.email(),
  password: chance.word({ length: 10 }),
  github: chance.email(),
  linkedin: chance.email(),
  bio: chance.sentence({ words: 15 }),
  ...data,
}));

Factory.blueprint('App/Models/Token', async (chance, i, data = {}) => ({
  token: randomBytes(128).toString('hex'),
  type: data.type || 'login',
  is_revoked: false,
  valid_until: moment()
    .add(2, 'h')
    .format(Env.get('TIMESTAMP_FORMAT', 'YYYY-MM-DD HH:mm:ss')),
  ...data,
}));

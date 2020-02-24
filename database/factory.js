
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

Factory.blueprint('App/Models/User', (faker, i, data = {}) => ({
  name: faker.name(),
  email: faker.email(),
  password: faker.word({ length: 10 }),
  github: faker.email(),
  linkedin: faker.email(),
  bio: faker.sentence({ words: 15 }),
  ...data,
}));

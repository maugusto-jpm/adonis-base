const { test, trait } = use('Test/Suite')('SessionController');
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should return JWT token when session created', async ({
  assert,
  client,
}) => {
  await Factory.model('App/Models/User').create({
    email: 'user@name.com',
    password: '123456',
  });

  const response = await client
    .post('/sessions')
    .send({
      email: 'user@name.com',
      password: '123456',
    })
    .end();

  response.assertStatus(200);
  assert.exists(response.body.token);
});

test('it should error when email not exists', async ({ client }) => {
  await Factory.model('App/Models/User').create({
    email: 'user@name.com',
    password: '123456',
  });

  const response = await client
    .post('/sessions')
    .send({
      email: 'user-name@name.com',
      password: '123456',
    })
    .end();

  response.assertStatus(404);
});

test('it should error when password is incorrect', async ({
  assert,
  client,
}) => {
  await Factory.model('App/Models/User').create({
    email: 'user@name.com',
    password: '123456',
  });

  const response = await client
    .post('/sessions')
    .send({
      email: 'user@name.com',
      password: '123',
    })
    .end();

  response.assertStatus(401);
  assert.include(response.body, { message: 'Incorrect email or password' });
});

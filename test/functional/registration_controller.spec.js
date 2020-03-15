const { test, trait } = use('Test/Suite')('RegistrationController');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should create user', async ({ assert, client }) => {
  const response = await client
    .post('/signin')
    .send({
      name: 'User Name',
      email: 'user@name.com',
      password: '123456',
    })
    .end();

  response.assertStatus(201);
  assert.exists(response.body.token);
});

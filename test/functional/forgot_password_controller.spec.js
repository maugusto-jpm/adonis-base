const { test, trait, beforeEach, afterEach } = use('Test/Suite')(
  'ForgotPasswordController'
);
const Mail = use('Mail');
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

beforeEach(() => {
  Mail.fake();
});

afterEach(() => {
  Mail.restore();
});

test('it should send an email with reset password instructions', async ({
  assert,
  client,
}) => {
  const sessionPayload = {
    email: 'user@name.com',
  };
  const user = await Factory.model('App/Models/User').create(sessionPayload);

  const response = await client
    .post('/forgot-password')
    .send(sessionPayload)
    .end();

  response.assertStatus(200);

  const recentEmail = Mail.pullRecent();
  assert.equal(recentEmail.message.to[0].address, sessionPayload.email);

  const token = await user.tokens().first();

  assert.include(token.toJSON(), {
    type: 'resetPassword',
  });
});

test('it should send error if email is not found', async ({ client }) => {
  const response = await client
    .post('/forgot-password')
    .send({ email: 'user@name.com' })
    .end();

  response.assertStatus(404);
});

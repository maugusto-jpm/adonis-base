const { test, trait } = use('Test/Suite')('ForgotPasswordController');
const Mail = use('Mail');

const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send an email with reset password instructions', async ({ assert, client }) => {
  Mail.fake();

  const sessionPayload = {
    email: 'user@name.com',
  };
  const user = await Factory
    .model('App/Models/User')
    .create(sessionPayload);

  const response = await client
    .post('/forgot-password')
    .send(sessionPayload)
    .end();

  response.assertStatus(200);

  const recentEmail = Mail.pullRecent();
  assert.equal(recentEmail.message.to[0].address, sessionPayload.email);

  Mail.restore();
});

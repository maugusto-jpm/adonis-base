const { test, trait, beforeEach, afterEach } = use('Test/Suite')(
  'ForgotPasswordController'
);
const Mail = use('Mail');
const Hash = use('Hash');
const { TimeService } = require('../../app/Services');

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
    type: 'reset_password',
  });
});

test('should be able to reset password', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    email: 'user@name.com',
    password: '123',
  });

  const { token } = await Factory.model('App/Models/Token').create({
    user_id: user.id,
    type: 'reset_password',
  });

  const response = await client
    .post('/reset-password')
    .send({
      token,
      password: '123456',
    })
    .end();

  await user.reload();

  response.assertStatus(200);
  const checkPassword = await Hash.verify('123456', user.password_hash);

  assert.isTrue(checkPassword);
});

test('it cannot reset password after 2 hours of forgot password', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create({
    email: 'user@name.com',
  });

  const { token } = await Factory.model('App/Models/Token').create({
    user_id: user.id,
    type: 'reset_password',
    valid_until: TimeService.now()
      .subtract(1, 'minute')
      .formatTimestamp(),
  });

  const response = await client
    .post('/reset-password')
    .send({
      token,
      password: '123456',
    })
    .end();

  await user.reload();

  response.assertStatus(400);
  const checkPassword = await Hash.verify('123456', user.password_hash);

  assert.isFalse(checkPassword);
  assert.equal(response.text, 'No valid token was found');
});

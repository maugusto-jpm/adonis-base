const { test, trait } = use('Test/Suite')('ResetPasswordController');
const Factory = use('Factory');
const Hash = use('Hash');
const { TimeService } = use('Services');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('should be able to reset password', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create({
    email: 'user@name.com',
    password: '123',
  });

  const { token } = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'resetPassword',
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
  const checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isTrue(checkPassword);
});

test('it cannot reset password when valid token is not found', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create({
    password: '123',
  });

  const loginToken = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'login',
  });

  const revokedToken = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'resetPassword',
    isRevoked: true,
  });

  const responseForLoginToken = await client
    .post('/reset-password')
    .send({
      token: loginToken.token,
      password: '123456',
    })
    .end();

  const responseForRevokedToken = await client
    .post('/reset-password')
    .send({
      token: revokedToken.token,
      password: '123456',
    })
    .end();

  await user.reload();

  responseForLoginToken.assertStatus(400);
  let checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isFalse(checkPassword);
  assert.equal(responseForLoginToken.text, 'No valid token was found');

  responseForRevokedToken.assertStatus(400);
  checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isFalse(checkPassword);
  assert.equal(responseForRevokedToken.text, 'No valid token was found');
});

test('it cannot reset password after 2 hours of forgot password', async ({
  assert,
  client,
}) => {
  const user = await Factory.model('App/Models/User').create({
    email: 'user@name.com',
  });

  const { token } = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'resetPassword',
    validUntil: TimeService.now()
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
  const checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isFalse(checkPassword);
  assert.equal(response.text, 'No valid token was found');
});

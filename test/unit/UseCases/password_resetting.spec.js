const { test, trait } = use('Test/Suite')('PasswordResetting');

const NoTokenWasProvidedException = use(
  'App/Exceptions/NoTokenWasProvidedException'
);
const Factory = use('Factory');
const Hash = use('Hash');
const { TimeService } = use('Services');

const { PasswordResetting } = use('UseCases');

trait('DatabaseTransactions');

test('should change password when token is valid', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create({
    email: 'user@name.com',
    password: '123',
  });

  const token = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'resetPassword',
  });

  await PasswordResetting.perform(token.token, '123456');

  await user.reload();
  await token.reload();

  const checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isTrue(checkPassword);
  assert.isTrue(token.isRevoked);
});

test('it cannot reset password when valid token is not found', async ({
  assert,
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

  try {
    await PasswordResetting.perform(loginToken.token, '123456');
  } catch (exception) {
    assert.instanceOf(exception, NoTokenWasProvidedException);
  }

  try {
    await PasswordResetting.perform(revokedToken.token, '123456');
  } catch (exception) {
    assert.instanceOf(exception, NoTokenWasProvidedException);
  }

  const checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isFalse(checkPassword);
});

test('it cannot reset password after 2 hours of forgot password', async ({
  assert,
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

  try {
    await PasswordResetting.perform(token, '123456');
  } catch (exception) {
    assert.instanceOf(exception, NoTokenWasProvidedException);
  }

  await user.reload();
  const checkPassword = await Hash.verify('123456', user.passwordHash);

  assert.isFalse(checkPassword);
});

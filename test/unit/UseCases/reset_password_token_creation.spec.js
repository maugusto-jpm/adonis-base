const { test, trait } = use('Test/Suite')('ResetPasswordTokenCreation');

const Factory = use('Factory');
const Token = use('App/Models/Token');

const { ResetPasswordTokenCreation } = require('../../../app/UseCases');

trait('DatabaseTransactions');

test('should revoke others reset password tokens', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create();

  const token1 = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'resetPassword',
    isRevoked: false,
  });

  const token2 = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'resetPassword',
    isRevoked: false,
  });

  const token3 = await Factory.model('App/Models/Token').create({
    userId: user.id,
    type: 'login',
    isRevoked: false,
  });

  await ResetPasswordTokenCreation.perform(user);
  await token1.reload();
  await token2.reload();
  await token3.reload();

  assert.isTrue(token1.isRevoked);
  assert.isTrue(token2.isRevoked);
  assert.isFalse(token3.isRevoked);
});

test('should create another token', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create();

  await ResetPasswordTokenCreation.perform(user);
  const createdToken = await Token.query()
    .resetPassword()
    .first();

  assert.include(createdToken.toJSON(), {
    type: 'resetPassword',
    isRevoked: false,
  });
});

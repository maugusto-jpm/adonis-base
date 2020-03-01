const { test, trait } = use('Test/Suite')('ResetPasswordTokenCreation');

const Factory = use('Factory');
const Token = use('App/Models/Token');

const { ResetPasswordTokenCreation } = require('../../../app/UseCases');

trait('DatabaseTransactions');

test('should revoke others reset password tokens', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create();

  const token1 = await Factory.model('App/Models/Token').create({
    user_id: user.id,
    type: 'reset_password',
    is_revoked: false,
  });

  const token2 = await Factory.model('App/Models/Token').create({
    user_id: user.id,
    type: 'reset_password',
    is_revoked: false,
  });

  const token3 = await Factory.model('App/Models/Token').create({
    user_id: user.id,
    type: 'login',
    is_revoked: false,
  });

  await ResetPasswordTokenCreation.perform(user);
  await token1.reload();
  await token2.reload();
  await token3.reload();

  assert.equal(token1.is_revoked, 1);
  assert.equal(token2.is_revoked, 1);
  assert.equal(token3.is_revoked, 0);
});

test('should create another token', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create();

  await ResetPasswordTokenCreation.perform(user);
  const createdToken = await Token.query()
    .resetPassword()
    .first();

  assert.include(createdToken.toJSON(), {
    type: 'reset_password',
    is_revoked: false,
  });
});

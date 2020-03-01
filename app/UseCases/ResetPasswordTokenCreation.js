const { randomBytes } = require('crypto');

const moment = use('moment');
const Env = use('Env');

class ResetPasswordTokenCreation {
  constructor(user) {
    this.user = user;
  }

  async perform() {
    await this.deactiveOthersTokens();
    return this.createNewToken();
  }

  async deactiveOthersTokens() {
    const otherTokens = await this.user
      .tokens()
      .resetPassword()
      .fetch();

    otherTokens.rows.forEach(async token => {
      token.is_revoked = true;
      return token.save();
    });
  }

  async createNewToken() {
    const token = randomBytes(
      parseInt(Env.get('TOKEN_LENGTH', '128'), 10)
    ).toString('hex');
    return this.user.tokens().create({
      token,
      type: 'reset_password',
      valid_until: moment()
        .add(2, 'h')
        .format(Env.get('TIMESTAMP_FORMAT', 'YYYY-MM-DD HH:mm:ss')),
    });
  }
}

module.exports = ResetPasswordTokenCreation;

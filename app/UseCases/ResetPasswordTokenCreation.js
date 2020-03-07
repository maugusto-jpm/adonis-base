const { randomBytes } = use('crypto');
const { TimeService } = use('Services');

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
      token.isRevoked = true;
      return token.save();
    });
  }

  async createNewToken() {
    const token = randomBytes(
      parseInt(Env.get('TOKEN_LENGTH', '128'), 10)
    ).toString('hex');
    return this.user.tokens().create({
      token,
      type: 'resetPassword',
      validUntil: TimeService.now()
        .add(2, 'h')
        .formatTimestamp(),
    });
  }
}

module.exports = ResetPasswordTokenCreation;

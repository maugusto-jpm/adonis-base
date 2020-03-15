const NoTokenWasProvidedException = use(
  'App/Exceptions/NoTokenWasProvidedException'
);
const Token = use('Token');

class PasswordResetting {
  constructor(token, newPassword) {
    this.token = token;
    this.newPassword = newPassword;
  }

  async perform() {
    const token = await Token.resetPasswordWithToken(this.token);

    if (!token) {
      throw new NoTokenWasProvidedException();
    }

    const user = await token.user().fetch();
    user.password = this.newPassword;
    token.isRevoked = true;
    await user.save();
    await token.save();
  }
}

module.exports = PasswordResetting;

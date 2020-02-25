const Token = use('App/Models/Token');

class ResetPasswordController {
  async index({ request, response }) {
    const { token, password } = request.only([
      'token',
      'password',
    ]);
    const userToken = await Token.findValidByToken(token);

    if (!userToken) {
      return response.status(400).send('No valid token was found');
    }

    const user = await userToken.user().fetch();
    user.password = password;
    await user.save();

    return response.status(200).send();
  }
}

module.exports = ResetPasswordController;

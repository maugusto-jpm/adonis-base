const Mail = use('Mail');
const Env = use('Env');
const url = require('url');

const { ResetPasswordTokenCreation } = require('../../UseCases');

const User = use('App/Models/User');

class ForgotPasswordController {
  async index({ request, response }) {
    const email = request.input('email');
    const user = await User.findByOrFail('email', email);

    await ResetPasswordTokenCreation.perform(user);
    const { host, port, protocol } = url.parse(Env.get('FRONTEND_URL'));
    const { token } = await user
      .tokens()
      .resetPassword()
      .first();

    const resetPasswordUrl = url.format({
      protocol,
      host,
      port,
      pathname: 'reset-password',
      query: {
        token,
      },
    });

    await Mail.send(
      'emails.reset_password',
      { name: user.name, resetPasswordUrl },
      message => {
        message
          .to(user.email)
          .from('email@provider.com')
          .subject('Recuperação de senha');
      }
    );

    response.status(200).send();
  }
}

module.exports = ForgotPasswordController;

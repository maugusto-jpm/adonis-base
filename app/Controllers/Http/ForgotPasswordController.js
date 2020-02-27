const Mail = use('Mail');
const Env = use('Env');
const moment = use('moment');
const { randomBytes } = require('crypto');
const url = require('url');

const User = use('App/Models/User');

class ForgotPasswordController {
  async index({ request, response }) {
    const email = request.input('email');
    const user = await User.findByOrFail('email', email);

    const token = randomBytes(128).toString('hex');
    const resetPasswordUrl = url.format({
      protocol: 'http',
      host: Env.get('FRONTEND_URL'),
      pathname: 'reset-password',
      query: {
        token,
      },
    });

    await user.tokens().create({
      token,
      type: 'reset_password',
      valid_until: moment()
        .add(2, 'h')
        .format(),
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

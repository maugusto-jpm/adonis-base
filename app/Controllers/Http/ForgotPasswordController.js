const Mail = use('Mail');

const User = use('App/Models/User');

class ForgotPasswordController {
  async index({ request, response }) {
    const email = request.input('email');
    const user = await User.findByOrFail('email', email);

    await Mail.send('emails.reset_password', { name: user.name }, (message) => {
      message
        .to(user.email)
        .from('email@provider.com')
        .subject('Recuperação de senha');
    });

    response.status(200).send();
  }
}

module.exports = ForgotPasswordController;

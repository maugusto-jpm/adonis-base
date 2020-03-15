const { PasswordResetting } = use('UseCases');
const NoTokenWasProvidedException = use(
  'App/Exceptions/NoTokenWasProvidedException'
);

class ResetPasswordController {
  async index({ request, response }) {
    const { token, password } = request.only(['token', 'password']);

    try {
      await PasswordResetting.perform(token, password);

      return response.status(200).send();
    } catch (exception) {
      if (exception instanceof NoTokenWasProvidedException) {
        return response.status(400).send('No valid token was found');
      }

      throw exception;
    }
  }
}

module.exports = ResetPasswordController;

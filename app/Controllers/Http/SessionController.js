class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.only([
      'email',
      'password',
    ]);

    const { token } = await auth.attempt(email, password);

    response.send({ token });
  }
}

module.exports = SessionController;

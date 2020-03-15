const User = use('User');

class RegistrationController {
  async store({ request, response, auth }) {
    const { name, email, password } = request.only([
      'name',
      'email',
      'password',
    ]);

    const user = new User();
    Object.assign(user, { name, email, password });
    await user.save();

    const { token } = await auth.attempt(email, password);

    response.status(201).send({ token });
  }
}

module.exports = RegistrationController;

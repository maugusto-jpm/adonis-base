const User = use('User');

class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password']);

    const user = await User.findByOrFail('email', email);

    if (!(await user.checkPassword(password))) {
      return response
        .status(401)
        .json({ message: 'Incorrect email or password' });
    }

    const { token } = await auth.attempt(email, password);

    response.send({ token });
  }
}

module.exports = SessionController;

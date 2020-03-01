const moment = use('moment');
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Token extends Model {
  static get dates() {
    return super.dates.concat(['valid_until']);
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  getIsRevoked(isRevoked) {
    return isRevoked === 1;
  }

  static scopeValid(query) {
    return query
      .where({
        is_revoked: false,
      })
      .andWhere(function() {
        this.whereNull('valid_until').orWhere(
          'valid_until',
          '>=',
          moment().format(Env.get('TIMESTAMP_FORMAT', 'YYYY-MM-DD HH:mm:ss'))
        );
      });
  }

  static scopeResetPassword(query) {
    return query.where({
      type: 'reset_password',
    });
  }

  static async resetPasswordWithToken(token) {
    return Token.query()
      .resetPassword()
      .valid()
      .where({ token })
      .first();
  }
}

module.exports = Token;

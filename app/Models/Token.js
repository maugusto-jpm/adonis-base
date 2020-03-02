const { TimeService } = require('../Services');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Token extends Model {
  static get dates() {
    return super.dates.concat(['validUntil']);
  }

  user() {
    return this.belongsTo('App/Models/User', 'userId');
  }

  static scopeValid(query) {
    return query
      .where({
        isRevoked: false,
      })
      .andWhere(function() {
        this.whereNull('validUntil').orWhere(
          'validUntil',
          '>=',
          TimeService.now().formatTimestamp()
        );
      });
  }

  static scopeResetPassword(query) {
    return query.where({
      type: 'resetPassword',
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

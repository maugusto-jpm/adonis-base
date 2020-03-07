const { TimeService } = use('Services');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Token extends Model {
  static boot() {
    super.boot();

    this.addHook('afterFind', tokenInstance => {
      tokenInstance.isRevoked =
        tokenInstance.isRevoked === 1 || tokenInstance.isRevoked === true;
    });
  }

  static get dates() {
    return super.dates.concat(['validUntil']);
  }

  user() {
    return this.belongsTo('User', 'userId');
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

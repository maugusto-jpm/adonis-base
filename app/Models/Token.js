const moment = use('moment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Token extends Model {
  static get dates() {
    return super.dates.concat(['valid_until']);
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  static async findValidByToken(token) {
    return Token
      .query()
      .where({
        token,
        is_revoked: 0,
        type: 'reset_password',
      })
      .andWhere((query) => {
        query.whereNull('valid_until')
          .orWhere('valid_until', '>=', moment().format('YYYY-MM-DD HH:mm:ss'));
      })
      .first();
  }
}

module.exports = Token;

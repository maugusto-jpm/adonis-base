/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

class User extends Model {
  static get hidden() {
    return ['passwordHash'];
  }

  static boot() {
    super.boot();

    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.passwordHash = await Hash.make(userInstance.password);
        delete userInstance.$attributes.password;
      }
    });
  }

  tokens() {
    return this.hasMany('Token');
  }

  checkPassword(password) {
    return Hash.verify(password, this.passwordHash);
  }
}

module.exports = User;

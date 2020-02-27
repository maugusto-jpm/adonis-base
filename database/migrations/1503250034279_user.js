/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table.string('name').notNullable();
      table
        .string('email')
        .notNullable()
        .unique();
      table.string('password_hash').notNullable();
      table.string('bio');
      table.string('github');
      table.string('linkedin');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
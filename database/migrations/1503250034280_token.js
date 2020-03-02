/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TokensSchema extends Schema {
  up() {
    this.create('tokens', table => {
      table.increments();
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users');
      table
        .string('token', 512)
        .notNullable()
        .unique()
        .index();
      table.enum('type', ['login', 'resetPassword']).notNullable();
      table.timestamp('validUntil');
      table.boolean('isRevoked').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('tokens');
  }
}

module.exports = TokensSchema;

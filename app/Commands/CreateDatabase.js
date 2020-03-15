const Database = use('Database');
const Env = use('Env');

const { Command } = require('@adonisjs/ace');

class CreateDatabase extends Command {
  static get signature() {
    return 'database:pg:create';
  }

  static get description() {
    return 'Creates Postgres or Mysql Database';
  }

  async handle() {
    // eslint-disable-next-line no-underscore-dangle
    const { database } = Database.Config._config;
    if (database.connection !== 'pg') {
      return this.warn('This database is not Postgres. Exiting...');
    }

    database.pg.connection.database = 'postgres';

    await Database.raw(`CREATE DATABASE ${Env.get('DB_DATABASE', 'adonis')}`);
    Database.close();
  }
}

module.exports = CreateDatabase;

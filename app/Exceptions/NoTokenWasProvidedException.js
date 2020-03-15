// eslint-disable-next-line import/no-extraneous-dependencies
const { LogicalException } = require('@adonisjs/generic-exceptions');

class NoTokenWasProvidedException extends LogicalException {}

module.exports = NoTokenWasProvidedException;

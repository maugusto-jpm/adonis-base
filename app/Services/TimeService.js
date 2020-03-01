const momentLib = use('moment-timezone');
const Env = use('Env');

class TimeService {
  // This should not be called outside this class, except in tests
  constructor(moment) {
    this.moment = moment;
  }

  static now() {
    return new TimeService(
      momentLib().tz(Env.get('TIMEZONE', 'America/Sao_Paulo'))
    );
  }

  static today() {
    return new TimeService(
      momentLib()
        .tz(Env.get('TIMEZONE', 'America/Sao_Paulo'))
        .startOf('day')
    );
  }

  formatTimestamp() {
    return this.moment.format(
      Env.get('TIMESTAMP_FORMAT', 'YYYY-MM-DD HH:mm:ss')
    );
  }

  add(amount, amountType) {
    this.moment.add(amount, amountType);
    return this;
  }

  subtract(amount, amountType) {
    this.moment.subtract(amount, amountType);
    return this;
  }
}

module.exports = TimeService;

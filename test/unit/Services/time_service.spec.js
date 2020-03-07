const { TimeService } = use('Services');

const Env = use('Env');
const momentLib = use('moment-timezone');

const { test, trait } = use('Test/Suite')('ResetPasswordTokenCreation');

trait('DatabaseTransactions');

test('.new should create an instance of class for now', async ({ assert }) => {
  const service = TimeService.now();
  const moment = momentLib().tz(Env.get('TIMEZONE', 'America/Sao_Paulo'));

  assert.instanceOf(service, TimeService);
  assert.instanceOf(service.moment, momentLib);
  assert.equal(
    service.moment.format('YYYY-MM-DD HH:mm:ss'),
    moment.format('YYYY-MM-DD HH:mm:ss')
  );
});

test('.today should create an instance of class for today', async ({
  assert,
}) => {
  const service = TimeService.today();
  const moment = momentLib().tz(Env.get('TIMEZONE', 'America/Sao_Paulo'));

  assert.instanceOf(service, TimeService);
  assert.instanceOf(service.moment, momentLib);
  assert.equal(
    service.moment.format('YYYY-MM-DD HH:mm:ss'),
    `${moment.format('YYYY-MM-DD')} 00:00:00`
  );
});

test('#formatTimestamp should return formatted string for timestamp', async ({
  assert,
}) => {
  const moment = momentLib().tz(Env.get('TIMEZONE', 'America/Sao_Paulo'));
  const service = new TimeService(moment);

  assert.equal(service.formatTimestamp(), moment.format('YYYY-MM-DD HH:mm:ss'));
});

test('#add should sum amount of time', async ({ assert }) => {
  const moment = momentLib().tz(Env.get('TIMEZONE', 'America/Sao_Paulo'));
  const service = new TimeService(moment.clone());

  assert.equal(
    service
      .add(2, 'd')
      .add(4, 'h')
      .add(5, 'y')
      .formatTimestamp(),
    moment
      .add(2, 'd')
      .add(4, 'h')
      .add(5, 'y')
      .format('YYYY-MM-DD HH:mm:ss')
  );
});

test('#subtract should subtract amount of time', async ({ assert }) => {
  const moment = momentLib().tz(Env.get('TIMEZONE', 'America/Sao_Paulo'));
  const service = new TimeService(moment.clone());

  assert.equal(
    service
      .subtract(2, 'd')
      .subtract(4, 'h')
      .subtract(5, 'y')
      .formatTimestamp(),
    moment
      .subtract(2, 'd')
      .subtract(4, 'h')
      .subtract(5, 'y')
      .format('YYYY-MM-DD HH:mm:ss')
  );
});

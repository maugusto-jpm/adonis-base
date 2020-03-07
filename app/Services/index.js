const fs = use('fs');
const path = use('path');

const basename = path.basename(__filename);

const services = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const service = require(path.join(__dirname, file));
    services[service.name] = service;
  });

module.exports = services;

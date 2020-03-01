const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

const useCases = {};

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const useCase = require(path.join(__dirname, file));
    useCase.perform = function(...args) {
      return new useCase(...args).perform(); // eslint-disable-line new-cap
    };
    useCases[useCase.name] = useCase;
  });

module.exports = useCases;

const log = require('@harvey1717/logger')();
const request = require('request-promise-native');
const login = require.main.require('./app/login');
const searchProducts = require.main.require('./app/searchProducts');
const logSizes = require.main.require('./app/logSizes');
const createListing = require.main.require('./app/createListing');

// TODO
// * Size selection
// * Auto lowest ask/price selection
// * Method of sale

const rSes = request.defaults({
  jar: request.jar(),
});

log.message('RESTOCKS.EU AUTO LISTER');

(async () => {
  try {
    const status = await login(rSes);
    log.log(`LOG IN SUCCESS -> "${status}"`);
    const selectedProd = await searchProducts(rSes);
    const selectedSize = await logSizes(rSes, selectedProd);
    const success = await createListing(rSes, selectedProd.id, selectedSize.id);
    if (!success) log.error(`LISTING ERROR -> SUCCESS "${success}"`);
    else log.success('LISTING CREATED!');
  } catch (ex) {
    log.error(ex.message);
  }
})();

const log = require('@harvey1717/logger')();
const request = require('request-promise-native');
const login = require.main.require('./app/login');
const searchProducts = require.main.require('./app/searchProducts');
const logSearchResults = require.main.require('./app/logSearchResults');

const rSes = request.defaults({
  jar: request.jar(),
});

log.message('RESTOCKS.EU AUTO LISTER');

(async () => {
  try {
    const status = await login(rSes);
    log.log(`LOG IN SUCCESS -> [${status}]`);
    const searchResults = await searchProducts(rSes);
    if (!searchResults > 0) throw Error('Cannot find any products with them keywords');
    await logSearchResults(searchResults);
  } catch (ex) {
    console.log(ex);
    log.error(ex.message);
  }
})();

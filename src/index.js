const log = require('@harvey1717/logger')();
const request = require('request-promise-native');
const login = require.main.require('./app/login');
const getMode = require.main.require('./app/getMode');
const searchProducts = require.main.require('./app/searchProducts');
const logSizes = require.main.require('./app/logSizes');
const createListing = require.main.require('./app/createListing');
const getListingsInfo = require.main.require('./app/scan/getListingsInfo');
const checkListing = require.main.require('./app/scan/checkListing');
const updateListing = require.main.require('./app/scan/updateListing');

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
    const mode = await getMode();
    if (mode.toLowerCase() === 'list') {
      while (true) {
        list(rSes);
      }
    } else {
      // while (true) {
      scan(rSes);
      // }
    }
  } catch (ex) {
    log.error(ex.message);
  }
})();

async function list(rSes) {
  const selectedProd = await searchProducts(rSes);
  const selectedSize = await logSizes(rSes, selectedProd);
  await createListing(rSes, selectedProd.id, selectedSize.id);
}

async function scan(rSes) {
  const listingsInfo = await getListingsInfo(rSes);
  let c = 0;
  for (listing of listingsInfo) {
    c++;
    const { changeNeeded, lowestAsk } = await checkListing(rSes, c, listing);
    if (changeNeeded) await updateListing(rSes, c, listing.productId, lowestAsk);
  }
}

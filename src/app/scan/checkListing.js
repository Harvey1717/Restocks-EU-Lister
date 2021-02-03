const log = require('@harvey1717/logger')();
const { whitelistedProducts } = require.main.require('../config/config');

module.exports = (rSes, c, listing) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { baseProductId, sizeId, productId, listingPrice, productName } = listing;
      const res = await rSes({
        uri: `https://restocks.net/product/get-lowest-price/${baseProductId}/${sizeId}/${productId}`,
        json: true,
      });

      if (res == 0) throw new Error('Lowest ask is 0');

      if (whitelistedProducts.includes(productName)) {
        log.mlog(productId, 'PRODUCT WHITELISTED');
        resolve({ changeNeeded: false });
        return;
      }

      if (parseFloat(res) < parseFloat(listingPrice)) {
        const percentageDecrease = ((parseFloat(listingPrice) - parseFloat(res)) / parseFloat(listingPrice)) * 100;
        //if (percentageDecrease >= 5) throw new Error('New listing price is more than 5% lower than current');
        log.mwarn(productId, `LISTING PRICE [€${listingPrice}] IS HIGHER THAN LOWEST ASK [€${res}]`);
        resolve({ changeNeeded: true, lowestAsk: res });
      } else if (parseFloat(res) > parseFloat(listingPrice)) {
        log.mwarn(productId, `LISTING PRICE [€${listingPrice}] IS LOWER THAN LOWEST ASK [€${res}]`);
        resolve({ changeNeeded: true, lowestAsk: res });
      } else {
        log.mlog(productId, 'PRICE IS GOOD');
        resolve({ changeNeeded: false });
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

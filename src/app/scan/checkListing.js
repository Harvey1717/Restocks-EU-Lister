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

      const lowestAsk = res;

      if (lowestAsk == 0) throw new Error('Lowest ask is 0');

      if (whitelistedProducts.includes(productName)) {
        log.mlog(productId, 'PRODUCT WHITELISTED');
        return resolve({ changeNeeded: false });
      } else if (
        whitelistedProducts.filter((prod) => prod.name === productName && prod.sizeIDs.includes(sizeId)).length > 0
      ) {
        log.mlog(productId, 'PRODUCT WITH SPECIFIC SIZE IS WHITELISTED');
        return resolve({ changeNeeded: false });
      }

      if (parseFloat(lowestAsk) < parseFloat(listingPrice)) {
        // const percentageDecrease = ((parseFloat(listingPrice) - parseFloat(res)) / parseFloat(listingPrice)) * 100;
        //if (percentageDecrease >= 5) throw new Error('New listing price is more than 5% lower than current');
        log.mwarn(productId, `LISTING PRICE [€${listingPrice}] IS HIGHER THAN LOWEST ASK [€${lowestAsk}]`);
        return resolve({ changeNeeded: true, lowestAsk: lowestAsk });
      } else if (parseFloat(lowestAsk) > parseFloat(listingPrice)) {
        log.mwarn(productId, `LISTING PRICE [€${listingPrice}] IS LOWER THAN LOWEST ASK [€${lowestAsk}]`);
        return resolve({ changeNeeded: true, lowestAsk: lowestAsk });
      } else {
        log.mlog(productId, 'PRICE IS GOOD');
        return resolve({ changeNeeded: false });
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

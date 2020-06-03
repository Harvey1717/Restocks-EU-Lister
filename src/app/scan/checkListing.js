const log = require('@harvey1717/logger')();

module.exports = (rSes, c, listing) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { baseProductId, sizeId, productId, listingPrice } = listing;
      const res = await rSes({
        uri: `https://restocks.eu/product/get-lowest-price/${baseProductId}/${sizeId}/${productId}`,
        json: true,
      });

      if (parseFloat(res) < parseFloat(listingPrice)) {
        log.mwarn(c, `LISTING PRICE [€${listingPrice}] IS HIGHER THAN LOWEST ASK [€${res}]`);
        resolve({ changeNeeded: true, lowestAsk: res });
      } else {
        log.mlog(c, 'PRICE IS GOOD');
        resolve({ changeNeeded: false });
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

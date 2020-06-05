const log = require('@harvey1717/logger')();

module.exports = (rSes, c, listing) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { baseProductId, sizeId, productId, listingPrice } = listing;
      const res = await rSes({
        uri: `https://restocks.eu/product/get-lowest-price/${baseProductId}/${sizeId}/${productId}`,
        json: true,
      });

      if (res == 0) throw new Error('Lowest ask is 0');

      if (parseFloat(res) < parseFloat(listingPrice)) {
        const percentageDecrease = ((parseFloat(listingPrice) - parseFloat(res)) / parseFloat(listingPrice)) * 100;
        if (percentageDecrease >= 5) throw new Error('New listing price is more than 5% lower than current');
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

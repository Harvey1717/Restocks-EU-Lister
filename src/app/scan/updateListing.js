const log = require('@harvey1717/logger')();
const getCsrfToken = require.main.require('./app/getCsrfToken');
const getPayout = require.main.require('./app/getPayout');
const { lowestAskDifference, specificConfig } = require.main.require('../config/config');

module.exports = (rSes, c, productId, lowestAsk) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userSetPrice = lowestAsk + lowestAskDifference;
      const specificConfigForListing = specificConfig.find((el) => el.listingId);
      if (specificConfigForListing) {
        log.mlog(c, `USING SPECIFIC DIFFERENCE -> ${specificConfigForListing.lowestAskDifference}`);
        userSetPrice = lowestAsk + specificConfigForListing.lowestAskDifference;
      }
      const res = await rSes({
        uri: 'https://restocks.eu/account/listings/edit',
        method: 'POST',
        form: {
          _token: await getCsrfToken(rSes),
          id: productId,
          price: getPayout(userSetPrice, 'resale'),
        }, //* Price = Payout
        json: true,
      });

      if (res.success) log.msuccess(c, `LISTING [${productId}] UPDATED -> €${userSetPrice}`);
      else log.error(`LISTING ERROR -> SUCCESS "${success}"`);
      resolve();
    } catch (ex) {
      reject(ex);
    }
  });
};

const log = require('@harvey1717/logger')();
const getCsrfToken = require.main.require('./app/getCsrfToken');
const getPayout = require.main.require('./app/getPayout');

module.exports = (rSes, c, productId, lowestAsk) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await rSes({
        uri: 'https://restocks.eu/account/listings/edit',
        method: 'POST',
        form: { _token: await getCsrfToken(rSes), id: productId, price: getPayout(lowestAsk, 'resale') }, //* Price = Payout
        json: true,
      });

      if (res.success) log.msuccess(c + 1, `LISTING UPDATED -> €${lowestAsk}`);
      else log.error(`LISTING ERROR -> SUCCESS "${success}"`);
      resolve();
    } catch (ex) {
      reject(ex);
    }
  });
};

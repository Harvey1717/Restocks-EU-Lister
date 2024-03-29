const cheerio = require('cheerio');
const { email, password } = require.main.require('../config/config');
const getLoginToken = require.main.require('./app/getLoginToken');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res;
      res = await rSes({
        method: 'POST',
        uri: 'https://restocks.co.uk/login',
        form: {
          _token: await getLoginToken(rSes),
          email,
          password,
        },
        simple: false,
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });
      res = await rSes({
        uri: 'https://restocks.co.uk/account',
        simple: false,
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });
      const $ = cheerio.load(res.body);
      const status = $('#my__account > h1').text();
      if (!res.request.href !== 'https://restocks.co.uk/account' && status.length > 0) {
        resolve(status);
      } else {
        reject(new Error('Logged in status is false'));
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

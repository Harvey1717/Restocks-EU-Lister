const cheerio = require('cheerio');
const getToken = require.main.require('./app/getToken');
const { email, password } = require.main.require('../config/config');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res;
      res = await rSes({
        method: 'POST',
        uri: 'https://restocks.eu/login',
        form: {
          _token: await getToken(rSes),
          email,
          password,
        },
        simple: false,
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });
      res = await rSes({
        uri: 'https://restocks.eu/account',
        simple: false,
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });
      const $ = cheerio.load(res.body);
      const status = $('#my__account > h1').text();
      if (!res.request.href !== 'https://restocks.eu/account' && status.length > 0) {
        resolve(status);
      } else {
        reject(new Error('Logged in status is false'));
      }
    } catch (ex) {
      reject(new Error('An error occured while trying to login'));
    }
  });
};

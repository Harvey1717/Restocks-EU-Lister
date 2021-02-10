const cheerio = require('cheerio');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await rSes({
        uri: 'https://restocks.co.uk/account',
      });
      const $ = cheerio.load(res);
      const token = $('[name="csrf-token"]').attr('content');
      resolve(token);
    } catch (ex) {
      reject(ex);
    }
  });
};

const cheerio = require('cheerio');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await rSes({
        uri: 'https://restocks.eu/login',
      });
      const $ = cheerio.load(res);
      const token = $('[name="_token"]').val();
      resolve(token);
    } catch (ex) {
      reject(new Error('An error occured while trying to login'));
    }
  });
};

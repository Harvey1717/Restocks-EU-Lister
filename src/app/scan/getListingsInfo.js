const cheerio = require('cheerio');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await rSes({
        uri: 'https://restocks.eu/account/listings/resale',
        qs: {
          page: '1',
        },
        json: true,
      });

      const $ = cheerio.load(res.products);
      const listings = $('tr.clickable');
      
      const listingsInfo = [];
      listings.each((i, elem) => {
        listingsInfo.push({
          listingPrice: $(elem).find('.storeprice__value').text(),
          productId: $(elem).find('.productid').val(),
          baseProductId: $(elem).find('.baseproductid').val(),
          sizeId: $(elem).find('.sizeid').val(),
        });
      });

      resolve(listingsInfo);
    } catch (ex) {
      reject(ex);
    }
  });
};

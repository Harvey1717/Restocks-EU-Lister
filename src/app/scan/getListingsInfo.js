const cheerio = require('cheerio');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listingsInfo = [];
      let pageNumber = 0;
      while (true) {
        pageNumber++;
        const res = await rSes({
          uri: 'https://restocks.eu/account/listings/resale',
          qs: {
            page: pageNumber,
          },
          json: true,
        });

        let html = res.products;
        if (html.includes('You have no advertisements yet')) return resolve(listingsInfo);
        if (!html.includes('table')) {
          html = `
          <table class="listings" width="100%">
          <thead>
          <tr>
          <th width="100"></th>
          <th>Item</th>
          <th>Price</th>
          <th width="100">Status</th>
          <th width="60"></th>
          </tr>
          </thead>
          <tbody>
          ${html}
          </tbody>
          </table>
          </body>
          </html>`;
        }
        const $ = cheerio.load(html);
        const listings = $('tr.clickable');

        listings.each((i, elem) => {
          listingsInfo.push({
            listingPrice: $(elem).find('.storeprice__value').text(),
            productId: $(elem).find('.productid').val(),
            baseProductId: $(elem).find('.baseproductid').val(),
            sizeId: $(elem).find('.sizeid').val(),
          });
        });
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

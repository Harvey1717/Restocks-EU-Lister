const inquirer = require('inquirer');
const log = require('@harvey1717/logger')();
const getCsrfToken = require.main.require('./app/getCsrfToken');
const { listingDelay } = require.main.require('../config/config');
const waitFor = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = (rSes, prodId, sizeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listingPrice = parseFloat(await askForInput('Listing price: £'));
      const sellMethod = await askForSellMethod();
      const quantity = await askForInput('Amount of times to create this listing: ');

      const sellerfee = {
        consignment: 0.95,
        resale: 0.9,
      };

      function getPayout(listingPrice) {
        const payout = parseInt(listingPrice) * sellerfee[sellMethod] - 10;
        if (payout < 0) {
          payout = 0;
        }
        return payout.toFixed(2);
      }

      const formData = {
        _token: await getCsrfToken(rSes),
        baseproduct_id: prodId,
        condition: '1',
        size_id: sizeId,
        price: getPayout(listingPrice), // * Payout
        store_price: listingPrice, // * User set listing price
        sell_method: sellMethod,
        duration: '30',
        checkbox1_resale: '',
        checkbox2_resale: '',
        checkbox1_consignment: '',
        checkbox2_consignment: '',
      };

      if (sellMethod === 'resale') {
        formData.checkbox1_resale = '1';
        formData.checkbox2_resale = '1';
      } else if (sellMethod === 'consignment') {
        throw new Error('Cosginment method temporarily disabled by Dev');
        formData.checkbox1_consignment = '1';
        formData.checkbox2_consignment = '1';
      } else {
        throw new Error('Sell method error');
      }

      for (let c = 0; c < parseInt(quantity); c++) {
        const success = await createListing(rSes, formData);
        if (success) log.msuccess(c + 1, 'LISTING CREATED!');
        else log.merror(c, `LISTING ERROR -> SUCCESS "${success}"`);
        log.log('Delaying');
        await waitFor(listingDelay);
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

function createListing(rSes, formData) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await rSes({
        method: 'POST',
        uri: 'https://restocks.eu/account/sell/create',
        headers: {
          authority: 'restocks.eu',
          accept: 'application/json, text/javascript, */*; q=0.01',
          'x-requested-with': 'XMLHttpRequest',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          origin: 'https://restocks.eu',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          referer: 'https://restocks.eu/account/sell',
          'accept-language': 'en-US,en;q=0.9',
        },
        form: formData,
        json: true,
      });
      resolve(res.success);
    } catch (ex) {
      reject(ex);
    }
  });
}

function askForInput(msg) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'input',
          message: msg,
        },
      ])
      .then(async (answer) => {
        resolve(answer.input);
      })
      .catch((error) => {
        if (error.isTtyError) {
          reject(new Error('Prompt cannot be rendered'));
        } else {
          reject(new Error('Unrecognised prompt error'));
        }
      });
  });
}

function askForSellMethod() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'sellMethod',
          message: 'Select Sale Method:',
          choices: ['resale', 'consignment'],
        },
      ])
      .then((answer) => {
        resolve(answer.sellMethod);
      })
      .catch((error) => {
        if (error.isTtyError) {
          reject(new Error('Prompt cannot be rendered'));
        } else {
          reject(new Error('Unrecognised prompt error'));
        }
      });
  });
}
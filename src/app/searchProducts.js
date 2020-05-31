const inquirer = require('inquirer');
const logSearchResults = require.main.require('./app/logSearchResults');

module.exports = (rSes) => {
  return new Promise(async (resolve, reject) => {
    try {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'input',
            message: 'Type Keywords [e.g "travis scott"]:',
          },
        ])
        .then(async (answer) => {
          const res = await rSes({
            uri: 'https://restocks.eu/shop/search',
            qs: {
              q: answer.input,
              page: '1',
            },
            json: true,
          });
          let searchResults = res.data.map((prod) => {
            return {
              id: prod.id,
              name: prod.name,
              sku: prod.sku,
              image: prod.image,
            };
          });
          searchResults = searchResults.slice(0, 3);
          if (!searchResults > 0) throw Error('Cannot find any products with them keywords');
          const selectedProd = await logSearchResults(searchResults);
          resolve(selectedProd);
        })
        .catch((error) => {
          if (error.isTtyError) {
            reject(new Error('Prompt cannot be rendered'));
          } else {
            reject(new Error('Unrecognised prompt error'));
          }
        });
    } catch (ex) {
      reject(ex);
    }
  });
};

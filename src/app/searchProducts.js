const inquirer = require('inquirer');

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
          searchResults = res.data.map((prod) => {
            return {
              id: prod.id,
              name: prod.name,
              sku: prod.sku,
              image: prod.image,
            };
          });
          resolve(searchResults.slice(0, 3));
        })
        .catch((error) => {
          console.log(error);
          if (error.isTtyError) {
            reject(new Error('Prompt cannot be rendered'));
          } else {
            reject(new Error('Unrecognised prompt error'));
          }
        });
    } catch (ex) {
      reject(new Error('An error occured while trying to find products'));
    }
  });
};

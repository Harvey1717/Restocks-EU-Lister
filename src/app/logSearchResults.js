const inquirer = require('inquirer');

module.exports = (searchResults) => {
  return new Promise(async (resolve, reject) => {
    try {
      const searchResultsF = searchResults.map((prod) => `${prod.name} - ${prod.sku}`);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'product',
            message: 'Select Product:',
            choices: searchResultsF,
          },
        ])
        .then((answer) => {
          const selectedProduct = searchResults.find((prod) => prod.sku === answer.product.split(' - ')[1]);
          resolve(selectedProduct);
        })
        .catch((error) => {
          if (error.isTtyError) {
            reject(new Error('Prompt cannot be rendered'));
          } else {
            reject(new Error('Unrecognised prompt error'));
          }
        });
    } catch (ex) {
      reject(new Error('An error occured while trying to show products'));
    }
  });
};

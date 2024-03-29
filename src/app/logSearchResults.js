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
          const selectedProduct = searchResults.find((prod) => answer.product.includes(prod.sku));
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
      reject(ex);
    }
  });
};

const inquirer = require('inquirer');

module.exports = (rSes, selectedProd) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await rSes({
        uri: `https://restocks.co.uk/product/get-sizes/${selectedProd.id}`,
        json: true,
      });
      const sizes = res.map((size) => size.name);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'size',
            message: 'Select Size:',
            choices: sizes,
          },
        ])
        .then((answer) => {
          resolve(res.find((size) => size.name === answer.size));
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

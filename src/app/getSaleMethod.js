const inquirer = require('inquirer');

module.exports = () => {
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
};

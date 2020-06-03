const inquirer = require('inquirer');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'mode',
            message: 'Select Mode:',
            choices: ['List', 'Scan'],
          },
        ])
        .then((answer) => {
          resolve(answer.mode);
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

const { v4: uuidv4 } = require('uuid');

function generateLogin(firstName, lastName) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
}

function generatePassword() {
    return uuidv4().split('-')[0];
}

module.exports = { generateLogin, generatePassword };
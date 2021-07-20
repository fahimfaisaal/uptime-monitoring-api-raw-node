// module dependencies
const crypto = require('crypto');

// relative dependencies
const { secretKey } = require('../helpers/environments');

// module scaffolding
const utility = {};

/**
 * return boolean, is param function or not
 * @param {any} param 
 * @returns {boolean}
 */
utility.isFunction = param => typeof param === 'function';

/**
 * return a valid object to a valid json, if not then return empty object
 * @param {any} json expect json
 * @returns {Object}
 */
utility.jsonParser = json => {
    let outputObject;

    try {
        outputObject = JSON.parse(json);
    } catch {
        outputObject = {};
    }

    return outputObject;
}

/**
 * return a hash format of passing string
 * @param {String} string 
 * @returns {String}
 */
utility.hash = string => {
    if (typeof string === 'string' && string) {
        return crypto
            .createHmac('sha256', secretKey)
            .update(string)
            .digest('hex');
    }

    return '';
}

/**
 * check is the user valid or not
 * @param {Object} user 
 * @returns {boolean}
 */
utility.isValidUser = user => {
    const { name, email, phone, password } = user;

    const validUserRegex = {
        name: /([a-z]|\s){2,}/gi.test(name),
        email: /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/.test(email),
        phone: /[0-9]{6,11}/.test(phone),
        password: /./.test(password)
    }

    return Object
        .values(validUserRegex)
        .every(value => value === true);
}

/**
 * check is the user valid or not
 * @param {Object} user 
 * @returns {boolean}
 */
utility.isValidToken = user => {
    const { phone, password } = user;

    const validUserRegex = {
        phone: /[0-9]{6,11}/.test(phone),
        password: /./.test(password)
    }

    return Object
        .values(validUserRegex)
        .every(value => value === true);
}

/**
 * Generate a token object
 * @param {number} stringLength 
 * @returns {Object}
 */
utility.tokenGenerator = stringLength => {
    // ascii characters 41 to 126 only word and digits
    const characters = utility
        .asciiCharGenerator(41, 126)
        .replace(/[^\d\w]|_/gi, '');
    
    let token = '';

    while (stringLength--) {
        const randNumber = Math.ceil(
            Math.random() * characters.length
        ) - 1;

        token += characters.charAt(randNumber);
    }

    return token;
}

/**
 * Ascii characters generator by start and end length
 * @param {number} start 
 * @param {number} end 
 * @returns {string}
 */
utility.asciiCharGenerator = (start = 0, end = 255, step = 1) => {
    let characters = '';

    for (let i = start; i < end + 1; i += step) {
        characters += String.fromCharCode(i);
    }

    return characters;
}

module.exports = utility
// module dependencies
const crypto = require('crypto');

// relative dependencies
const { secretKey } = require('../helpers/environments');

/**
 * return boolean is param function or not
 * @param {any} param 
 * @returns {boolean}
 */
exports.isFunction = param => typeof param === 'function';

/**
 * return a valid object to a valid json, if not then return empty object
 * @param {any} json expect json
 * @returns {Object}
 */
exports.jsonParser = json => {
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
exports.hash = string => {
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
exports.isValidUser = user => {
    const { name, email, phone, password } = user;

    const validUserRegex = {
        name: /([a-z]|\s){2,}/gi.test(name),
        email: /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/.test(email),
        phone: /[0-9]{6,11}/.test(phone),
        password: /./.test(password)
    }

    return Object.values(validUserRegex).every(value => value === true);
}
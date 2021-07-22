// module dependencies
const crypto = require('crypto');

// relative dependencies
const { secretKey } = require('../helpers/environments');

// module scaffolding
const utility = {};

/**
 * Function tester
 * @param {*} param 
 * @returns {boolean} - return boolean, is param function or not
 */
utility.isFunction = param => typeof param === 'function';

/**
 * return a valid object to a valid json, if not then return empty object
 * @param {*} json - expect json
 * @returns {object}
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
 * Hash converter
 * @param {string} string 
 * @returns {string} - return a hash format of passing string
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
 * @param {object} user 
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
 * @param {object} user 
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
 * @param {string} variant - options low, mid, hard (default - mid)
 * @param {number} stringLength - length of token
 * @returns {string} - token
 */
utility.tokenGenerator = (variant = 'mid', stringLength) => {
    // tokens variants
    const variants = {
        low: {
            range: [101, 122],
            regex: /[\[\\\]\^_`]/g,
            length: 10
        },
        mid: {
            range: [41, 122],
            regex: /[^\d\w]|_/gi,
            length: 20
        },
        hard: {
            range: [41, 126],
            regex: /[;:<==>`\.,]/g,
            length: 25
        }
    }

    const acceptedVariant = variants[variant] || variants.mid;
    const [start, end] = acceptedVariant.range;

    // ascii characters by selected variant
    const characters = utility
        .asciiCharGenerator(start, end)
        .replace(acceptedVariant.regex, '');
    
    let token = '';

    // if string length not passed then select default
    stringLength = stringLength ? stringLength : acceptedVariant.length;

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
 * @param {number} start - default start from ascii char code 0
 * @param {number} end - default end with ascii char code 255
 * @returns {string} - return the linear ascii characters
 */
utility.asciiCharGenerator = (start = 0, end = 255, step = 1) => {
    let characters = '';

    for (let i = start; i < end + 1; i += step) {
        characters += String.fromCharCode(i);
    }

    return characters;
}

module.exports = utility
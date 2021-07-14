const crypto = require('crypto');
const { secretKey } = require('../helpers/environments');

exports.isFunction = param => typeof param === 'function';

exports.jsonParser = json => {
    let outputObject;

    try {
        outputObject = JSON.parse(json);
    } catch {
        outputObject = {};
    }

    return outputObject;
}

exports.hash = string => {
    if (typeof string === 'string' && string) {
        return crypto
            .createHmac('sha256', secretKey)
            .update(string)
            .digest('hex');
    }

    return '';
}

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
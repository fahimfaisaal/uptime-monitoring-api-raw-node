/**
* Title: handle token by method
* Description: handle GET, POST, PUT, DELETE methods
* Author: @fahimfaisaal
*/

// module dependencies
const fs = require('fs');
const path = require('path');

// relative dependencies
const {
    isFunction,
    hash,
    isValidToken,
    tokenGenerator
} = require('../lib/util');
const {
    createDir,
    createFile,
    readFile,
    updateFile,
    deleteFile
} = require('../lib/crud');
const { storageDir } = require('./userHandler');

const token = {};

// storage directory name
token.storageDir = 'tokens'

token.tokenHandler = (requestProperties, callback) => {
    const reqMethod = requestProperties.method;
    // check the request method
    const acceptedMethod = token.methods[reqMethod];
    callback = isFunction(callback) ? callback : null;

    if (acceptedMethod) {
        return acceptedMethod(requestProperties, callback);
    }

    return callback(405, { message: `${reqMethod} method not allowed` });
}

// token methods object
token.methods = {};

/**
 * Post token method
 * @param {object} requestObject - distract only body
 * @callback responseCallback
 * @param {number} statusCode
 * @param {object} response
 */
token.methods.post = ({ body }, callback) => {
    // if token's data are valid
    if (isValidToken(body)) {
        const tokenObject = {
            ...body,
            password: hash(body.password)
        }

        // if tokenObject is valid then generate a token
        const { phone, password } = tokenObject;

        // read the user file by phone number
        return readFile(storageDir, phone, (err, userData) => {
            if (!err) {
                if (userData.password === password) {
                    const tokenId = tokenGenerator('mid');
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        tokenId,
                        expires
                    }

                    return createDir(token.storageDir, message => {
                        return createFile(token.storageDir, tokenId, tokenObject, (err, res) => {
                            const response = {
                                fileMessage: err ? err.message : res,
                                dirMessage: message
                            }

                            if (err) {
                                return callback(500, { message: response });
                            }

                            return callback(200, { message: response });
                        })
                    })
                }

                return callback(405, { message: 'Password not valid! please try again.' });
            }

            return callback(500, { message: `${phone}.json is not exist!` });
        })
    }

    //  if token's data not valid
    return callback(405, { message: "token object not valid!" });
}

/**
 * Get token method
 * @param {Object} requestObject - distract body and queryString
 * @callback responseCallback
 * @param {number} statusCode
 * @param {object} response
 */
token.methods.get = ({ queryStringObject, body }, callback) => {
    const queryStringLen = Object.keys(queryStringObject).length;
    let userPath;

    // if get token by phone number
    if (
        (queryStringLen && 'id' in queryStringObject) ||
        'id' in body
    ) {
        const userId = queryStringObject.id || body.id;
        userPath = path.resolve('.data', token.storageDir, userId + '.json');

        // check is file is exists or not
        return fs.access(userPath, err => {
            if (err) {
                return callback(405, { message: `${userId} is not exist!` });
            }

            return readFile(token.storageDir, userId, (readErr, userData) => {
                if (readErr) {
                    return callback(500, readErr);
                }

                return callback(200, userData);
            })
        })
    }

    return callback(405, { message: 'Please input user id.'})
}

token.methods.put = ({ body, queryStringObject, method }, callback) => {
    // if token is valid
    const number = body.phone || queryStringObject.phone;
    const userPath = path.resolve('.data', token.storageDir, number + '.json');

    if (number) {
        return fs.access(userPath, err => {
            if (err) {
                return createFile(token.storageDir, number, body, (err, res) => {
                    if (err) {
                        return callback(405, { message: err });
                    }

                    return callback(200, { message: res + ' cause it didn\'t there.' });
                })
            }

            return updateFile(token.storageDir, number, body, method, (err, res) => {
                // if have any type of error
                if (err) {
                    return callback(500, { message: err })
                }

                return callback(200, { message: res })
            })
        })
    }

    return callback(405, { message: "token not valid!" });
}

token.methods.patch = ({ body, queryStringObject, method }, callback) => {
    // if token is valid
    const number = body.phone || queryStringObject.phone;

    if (number) {
        return updateFile(token.storageDir, number, body, method, (err, res) => {
            // if have any type of error
            if (err) {
                return callback(500, { message: err.message });
            }

            return callback(200, { message: res });
        })
    }

    return callback(405, { message: "token not valid!" });
}

token.methods.delete = ({ body, queryStringObject }, callback) => {
    const number = body.phone || queryStringObject.phone
    // if token is valid

    if (number) {
        return deleteFile(token.storageDir, number, (err, res) => {
            // if have any type of error
            if (err) {
                return callback(405, { message: "number not valid!" });
            }

            return callback(200, res);
        })
    }

    callback(405, { message: "please enter a number." })

}

module.exports = token
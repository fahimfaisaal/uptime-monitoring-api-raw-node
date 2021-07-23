/**
* Title: handle user by method
* Description: handle GET, POST, PUT, DELETE methods
* Author: @fahimfaisaal
*/

// module dependencies
const fs = require('fs');
const path = require('path');

// relative dependencies
const { isFunction, hash, isValidUser } = require('../lib/util');
const {
    createDir,
    createFile,
    readFile,
    updateFile,
    deleteFile
} = require('../lib/crud');

const tokenHandler = require('./tokenHandler');

const user = {};

// storage directory name
user.storageDir = 'users'

user.userHandler = (requestProperties, callback) => {
    const reqMethod = requestProperties.method;
    // check the request method
    const acceptedMethod = user.methods[reqMethod];
    callback = isFunction(callback) ? callback : null;

    if (acceptedMethod) {
        return acceptedMethod(requestProperties, callback);
    }

    return callback(405, {message: `${reqMethod} method not allowed`});
}

// user methods object
user.methods = {};

// TODO: Authentication check
user.methods.post = ({ body }, callback) => {
    // if user's data are valid
    if (isValidUser(body)) {
        const userObject = {
            ...body,
            password: hash(body.password)
        }

        // if user directory not exist it'll be create
        return createDir(user.storageDir, message => {
            return createFile(user.storageDir, userObject.phone, userObject, (err, res) => {
                // create response object
                const response = {
                    fileMessage: err ? err.message : res,
                    dirMessage: message
                }

                if (err) {
                    // error response
                    return callback(500, response);
                }

                return callback(200, response);
            });
        });
    }

    //  if user's data not valid
    return callback(405, { message: "user not valid!" });
}

user.methods.get = ({ queryStringObject, body, headerObject }, callback) => {
    const queryStringLen = Object.keys(queryStringObject).length;
    let userPath;

    // if get user by phone number
    if (
        (queryStringLen && 'phone' in queryStringObject) ||
        'phone' in body
    ) {
        const userNumber = queryStringObject.phone || body.phone;
        userPath = path.resolve('.data', user.storageDir , userNumber + '.json');

        return fs.access(userPath, err => {
            if (err) {
                return callback(405, { message: `${userNumber} is not exist!` });
            }

            return readFile(user.storageDir, userNumber, (readErr, userData) => {
                if (readErr) {
                    return callback(500, readErr);
                }

                // check authentication
               return tokenHandler.methods.verify(headerObject.token, userNumber, isVerified => {
                    if (isVerified) {
                        return callback(200, userData)
                    }

                    return callback(403, {
                        message: 'user not verified!'
                    });
                })
            })
        })
    }

    userPath = path.resolve('.data', user.storageDir);

    // read the .data directory
    fs.readdir(userPath, 'utf-8', (err, files) => {
        if (err) {
            return callback(405, err.message);
        }
        
        // resolve all users
        const resolveUsers = files.reduce((usersArray, userFile) => {
            const basename = path.basename(userFile, '.json');

            // resolving one by one user by using Promise
            const resolveUser = new Promise((resolve, reject) => {
                readFile(user.storageDir, basename, (err, userObject) => {
                    if (!err) {
                        const { name, email, phone } = userObject;

                        // get users except password
                        return resolve({
                            name,
                            email
                        });
                    }

                   return reject(err.message);
                });
            });

            // push the resolveUser
            usersArray.push(resolveUser);
            
            return usersArray;
        }, []);

        // response all users
        const getAllUsers = Promise.all(resolveUsers);

        getAllUsers
            .then(users => {
                callback(200, users);
            })
            .catch(err => {
                callback(500, err);
            });
    })
}

// TODO: Authentication check
user.methods.put = ({ body, queryStringObject, method }, callback) => {
    // if user is valid
    const number = body.phone || queryStringObject.phone;
    const userPath = path.resolve('.data', user.storageDir, number + '.json');

    if (number) {
       return fs.access(userPath, err => {
            if (err) {
                return createFile(user.storageDir, number, body, (err, res) => {
                    if (err) {
                        return callback(405, { message: err });
                    }

                    return callback(200, { message: res + ' cause it didn\'t there.' });
                })
            }

            return updateFile(user.storageDir, number, body, method, (err, res) => {
                // if have any type of error
                if (err) {
                    return callback(500, { message: err })
                }

                return callback(200, { message: res })
            })
        })
    }
 
    return callback(405, { message: "user not valid!" });
}

// TODO: Authentication check
user.methods.patch = ({ body, queryStringObject, method }, callback) => {
    // if user is valid
    const number = body.phone || queryStringObject.phone;

    if (number) {
        return updateFile(user.storageDir, number, body, method, (err, res) => {
            // if have any type of error
            if (err) {
                return callback(500, { message: err.message });
            }

            return callback(200, { message: res });
        })
    }

    return callback(405, { message: "user not valid!" });
}

// TODO: Authentication check
user.methods.delete = ({ body, queryStringObject }, callback) => {
    const number = body.phone || queryStringObject.phone
    // if user is valid

    if (number) {
       return deleteFile(user.storageDir, number, (err, res) => {
            // if have any type of error
            if (err) {
                return callback(405, { message: "number not valid!" });
            }

            return callback(200, res);
        })
    }

    callback(405, { message: "please enter a number."})
    
}

module.exports = user
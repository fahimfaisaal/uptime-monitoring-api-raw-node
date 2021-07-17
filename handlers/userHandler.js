/**
* Title: handle user by method
* Description: handle GET, POST, PUT, DELETE methods
* Author: @fahimfaisaal
*/
const fs = require('fs');
const path = require('path');

// relative dependencies
const { isFunction, hash, isValidUser } = require('../lib/util');
const { createDir, createFile, readFile, updateFile, deleteFile } = require('../lib/crud');

const user = {};

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

user.methods = {};

user.methods.get = ({ queryStringObject }, callback) => {
    const queryStringLen = Object.keys(queryStringObject).length;
    let userPath;

    // if get user by phone number
    if (queryStringLen && 'number' in queryStringObject) {
        const userNumber = queryStringObject.number;
        userPath = path.resolve('.data', user.storageDir , userNumber + '.json');

        return fs.access(userPath, err => {
            if (err) {
                return callback(405, { message: `${userNumber} is not exist!` });
            }

            return readFile(user.storageDir, userNumber, (readErr, userData) => {
                if (readErr) {
                    return callback(500, readErr);
                }

                return callback(200, userData);
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
                        return resolve(userObject);
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

user.methods.put = ({ body, queryStringObject }, callback) => {
    // if user is valid
    if (isValidUser(body)) {
        const newData = JSON.parse(body);

        return updateFile(user.storageDir, queryStringObject.number, newData, (err, res) => {
            // if have any type of error
            if (err) {
                return callback(405, err.message);
            }

            return callback(200, res);
        })
    }

    return callback(405, { message: "user not valid!" });
}

user.methods.delete = ({ body, queryStringObject }, callback) => {
    // if user is valid
    if (isValidUser(body)) {
        return deleteFile(user.storageDir, queryStringObject.number, (err, res) => {
            // if have any type of error
            if (err) {
                return callback(405, err.message);
            }

            return callback(200, res);
        })
    }

    return callback(405, { message: "user not valid!" });
}

module.exports = user
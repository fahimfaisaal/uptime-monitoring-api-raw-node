/**
* Title: handle user by method
* Description: handle GET, POST, PUT, DELETE methods
* Author: @fahimfaisaal
*/

const { isFunction, hash, isValidUser } = require('../lib/util');
const { createDir, createFile } = require('../lib/crud');

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

user.methods.get = (requestProperties, callback) => {

}

user.methods.post = ({ body }, callback) => {
    // if user's data are valid
    if (isValidUser(body)) {
       const userObject = {
            ...body,
            password: hash(body.password)
        }

        return createDir(user.storageDir, message => {
            return createFile(user.storageDir, userObject.phone, userObject, (err, res) => {
                const response = {
                    fileMessage: err ? err.message : res,
                    dirMessage: message
                }

                if (err) {
                    return callback(500, response);
                }

                return callback(200, response)
            });
        });
    }

    return callback(405, {message: "user not valid!"})
}

user.methods.put = (requestProperties, callback) => {

}

user.methods.delete = (requestProperties, callback) => {

}

module.exports = user
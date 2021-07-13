/**
* Title: handle user by method
* Description: handle GET, POST, PUT, DELETE methods
* Author: @fahimfaisaal
*/

const { isFunction } = require('../lib/util');

exports.userHandler = (requestProperties, callback) => {
    const reqMethod = requestProperties.method;
    // check the request method
    const acceptedMethod = exports.methods[reqMethod];
    callback = isFunction(callback) ? callback : null;

    if (acceptedMethod) {        
        return acceptedMethod(requestProperties, callback);
    }

    return callback(405, {message: `${reqMethod} method not allowed`});
}

exports.methods = {};

exports.methods.get = (requestProperties, callback) => {
    
}

exports.methods.post = (requestProperties, callback) => {

}

exports.methods.put = (requestProperties, callback) => {

}

exports.methods.delete = (requestProperties, callback) => {

}
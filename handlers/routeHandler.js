/**
* Title: All route handlers
* Description: implement All route handlers
* Author: @fahimfaisaal
*/

exports.rootHandler = (handleReqObj, callback) => {
    callback(200, {
        message: `It's a root route`
    })
}

exports.notFoundHandler = (handleReqObj, callback) => {
    callback(404, {
        message: `404 Invalid route: ${handleReqObj.trimmedPath}`
    })
}
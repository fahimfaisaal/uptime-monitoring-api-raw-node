/**
* Title: All route handlers
* Description: implement All route handlers
* Author: @fahimfaisaal
*/

exports.rootHandler = (handleReqObj, callback) => {
    // root handler response
    callback(200, {
        message: `It's a root route`
    })
}

exports.notFoundHandler = (handleReqObj, callback) => {
    // not found route response
    callback(404, {
        message: `404 Invalid route: ${handleReqObj.trimmedPath}`
    })
}
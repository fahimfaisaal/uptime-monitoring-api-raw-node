/**
* Title: routes
* Description: it's maintain all routes by path name
* Author: @fahimfaisaal
*/

// relative dependencies
const { rootHandler, notFoundHandler } = require('./handlers/routeHandler');
const { userHandler } = require('./handlers/userHandler');
const { tokenHandler } = require('./handlers/tokenHandler');

// All routes object
const routes = {
    '/': rootHandler,
    user: userHandler,
    token: tokenHandler,
    notFound: notFoundHandler
};

module.exports = routes;
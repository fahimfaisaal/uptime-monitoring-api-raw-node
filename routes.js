/**
* Title: routes
* Description: it's maintain all routes by path name
* Author: @fahimfaisaal
*/

// dependencies
const handlers = require('./handlers/routeHandler');
const { userHandler } = require('./handlers/userHandler');

// All routes object
const routes = {
    '/': handlers.rootHandler,
    user: userHandler,
    notFound: handlers.notFoundHandler
};

module.exports = routes;
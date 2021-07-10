/**
* Title: routes
* Description: it's maintain all routes by path name
* Author: @fahimfaisaal
*/

// dependencies
const handlers = require('./handlers/routeHandler');

// All routes object
const routes = {
    '/': handlers.rootHandler,
    notFound: handlers.notFoundHandler
};

module.exports = routes;
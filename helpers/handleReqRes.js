const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');

// handle request and response
exports.handleReqRes = (req, res) => {
    const template = `
    <h1>Bismillah</h1>
    `;

    // Handle Request
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '') || '/';
    const queryStringObject = parseUrl.query;
    const reqMethod = req.method.toLowerCase();
    
    // request object
    const handleRequestObject = {
        parseUrl,
        queryStringObject,
        path,
        trimmedPath,
        reqMethod
    }

    // choose handler by req routes
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : routes.notFound;

    // decode the buffers
    const decoder = new StringDecoder('utf-8');
    let textContent = '';

    req.on('data', buffer => {
        textContent += decoder.write(buffer);
    })

    req.on('end', () => {
        textContent += decoder.end();

        // Invoked the chosen handler
        chosenHandler(handleRequestObject, (statusCode = 500, response = {}) => {
            res.writeHead(statusCode);
            res.end(JSON.stringify(response));
        })

        return res.end(template);
    })
}
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
    const method = req.method.toLowerCase();
    
    // request object
    const handleRequestObject = {
        parseUrl,
        queryStringObject,
        path,
        trimmedPath,
        method
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
            const jsonResponse = JSON.stringify(response);

            res.setHeader('Content-Type', 'application/json');
            
            res.writeHead(statusCode);
            
            return res.end(jsonResponse);
        })
    })
}
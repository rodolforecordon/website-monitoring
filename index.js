/*
 * First project made fully in Node.JS as part of the Pirple's Node Master Class course
 * author: Rodolfo Recordon
 */

// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

// PORT
const port = 3000

// 0 The server should respond to all requests WITH A STRING
var server = http.createServer((req, res) => {

    // 1 Get URL and parse it
    var parsedUrl = url.parse(req.url, true)

    // 2 Get the path
    var path = parsedUrl.pathname
    var trimmedPath = path.replace(/^\/+|\/+$/g,'')
    console.log(trimmedPath)

    // 3 Get the query string as an object
    var queryStringObject = parsedUrl.query

    // 4 Get the HTTP method
    var method = req.method.toLowerCase()

    // 5 Get the headers as an object
    var headers = req.headers

    // 6 Get the payload, if any
    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data', data => {
        buffer += decoder.write(data)   
    })
    req.on('end', () => {
        buffer += decoder.end()

        // Choose de handler this request should go to. If one is not found, use the notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload)=>{
            // Use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // Use the payload called back by the handler or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {}

            // Convert the payloa to a string
            var payloadString = JSON.stringify(payload)

            // Return the response
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            // Log the request path
            console.log('Request this response', statusCode, payloadString)

        })
        
    })
})

// 0 Start the server and have it listen on defined port
server.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})

// ROUTERS
// 7 Define the handlers
var handlers = {}

// 8 Sample handlers
handlers.sample = (data, callback) => {
    // Callback a http status code and a payload object (we are building this api to work with json exclusive)
    callback(406, {'name': 'sample handler'})
}

// 9 Not found handler
handlers.notFound = (data, callback) => {
    callback(404)
}

// 10 Define a request router
var router = {
    'sample' : handlers.sample
}
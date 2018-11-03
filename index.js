/*
 * Primary file for API
 * download https://nodejs.org version LTS
 * download https://www.getpostman.com
 * download https://atom.io/
 * download https://slproweb.com/products/Win32OpenSSL.html
 */

// Dependencies - Bring in libraries as var declaration
// 001
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');


 // Instantiate the server to respond to all requests with a string
 // Create server object - http createServer + function
 // 002 - to call 'curl localhost:3000/foo/'
 // to call set NODE_ENV=production&&node index.js
 var httpServer = http.createServer(function(req,res){
   unifiedServer(req,res);
 });

// Start the server, and listen on port 3000
// 003
//server.listen(3000,function(){
//  console.log('The server is up and listening on port 3000 now');
//});

// Start the server, and listen on port 3000
// 010 - SET NODE_ENV=production & node index.js
httpServer.listen(config.httpPort,function(){
  console.log('The server is up and listening on port '+config.httpPort+' in '+config.envName+' mode');
});

// Instantiate the HTTPS server
var httpsServerOptions = {
  'key': fs.readFileSync('./certificate/key.pem'),
  'cert': fs.readFileSync('./certificate/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
  console.log('The server is up and listening on port '+config.httpsPort+' in '+config.envName+' mode');
});


// All the server logic for both the http and https server
var unifiedServer = function(req,res){
  // Get the url and parse the url
  // 'true' invoke query string module
  // 004
  var parsedUrl = url.parse(req.url, true);
  // Get the path untrimmed
  var path = parsedUrl.pathname;
  // Get trimmed path
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  // 006
  var queryStringObject = parsedUrl.query;

  // Get the http method
  // 005
  var method = req.method.toLowerCase();

  // Get the header as an object
  // 007
  var headers = req.headers;

  // Get the payload
  // 008
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    // 009
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){

      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) == 'object'? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);

      payloadString = "Hello World back to the World";

      res.end(payloadString);
      console.log("Returning this response: ",statusCode,payloadString);

    });


    // Send the response
    //res.end('Hello World!\n');

    // Log the request/response
    //console.log('Request received on path: '+trimmedPath+' with method: '+method+' and this query string: ',queryStringObject);
    //console.log('Request received with these headers: ',headers);
    //console.log('Request received with these payload: ',buffer);
  });
};

// Define all the handlers
var handlers = {};

// Hello handler - getpostman localhost:9922/hello
handlers.hello = function(data,callback){
  callback(200);
}

// Define the request router
var router = {
  'hello' : handlers.hello
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Sample handler - getpostman localhost:3000/sample
//handlers.sample = function(data,callback){
//    callback(406,{'name':'sample handler'});
//};

// Define the request router
//var router = {
//  'sample' : handlers.sample
//};

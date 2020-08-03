const express = require('express');
const http = require('http')
const mongoose = require('mongoose');
//Importing expressJs to our application
const appConfig = require('./config/appConfig');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const globalErrorMiddleware = require('./middlewares/app-error-handler.middleware');
const routeLoggerMiddleware = require('./middlewares/route-logger.middleware');
const helmet = require('helmet');
const logger = require('./libs/logger.libs')


//declaring the instance of express (object of Class)
const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

//Custom Middleware handling Application Errors
app.use(globalErrorMiddleware.globalErrorHandler);
//for handling the cros
app.use(routeLoggerMiddleware.logIp)

//bootstrap module
let modelsPath = './models';
fs.readdirSync(modelsPath).forEach(function(file) {

    if (~file.indexOf('.js')) {
        console.log('adding models files');
        console.log(modelsPath + '/' + file);
        let route = require(modelsPath + '/' + file);
    }

});
//bootstrap route end



//bootstrap route
let routePath = './routes';
fs.readdirSync(routePath).forEach(function(file) {

    if (~file.indexOf('.js')) {
        console.log('adding files');
        console.log(routePath + '/' + file);
        let route = require(routePath + '/' + file);
        route.setRouter(app); //calling the setrouter function form routes folder > blog.js

    }

});
//bootstrap route end


//Custom Middleware handling Routes errors i.e 404
app.use(globalErrorMiddleware.globalNotFoundHandler);

// end global 404 handler
/**
 * Create HTTP server.
 */


 //Standard way of creating the server
const server = http.createServer(app)
    // start listening to http server
console.log(appConfig)
server.listen(appConfig.port)
server.on('error', onError)
server.on('listening', onListening)

// end server listening code

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10)
            throw error
    }
}


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    ('Listening on ' + bind)
    logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10)
    let db = mongoose.connect(appConfig.db.uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}


//
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
        // application specific logging, throwing an error, or other logic here
})


// handling mongoose connection error
mongoose.connection.on('error', function(err) {
    console.log('database connection error');
    console.log(err)

}); // end mongoose connection error

// handling mongoose success event
mongoose.connection.on('open', function(err) {
    if (err) {
        console.log("database error");
        console.log(err);

    } else {
        console.log("database connection open success");
    }

}); // end mongoose connection open handler
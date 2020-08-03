const response = require('./../libs/response.libs');
const logger = require('./../libs/logger.libs');

let erroHandler = (err, req, res, next) => {


        logger.error(err.message, 'Application error handler called', 10)
        let apiResponse = response.generate(true, 'Some error occured at global level', 500, null);
        res.status(500).send(apiResponse);

    } // end request ip logger function

let notFoundHandler = (req, res, next) => {

        // console.log("Global not found handler called");
        let apiResponse = response.generate(true, 'Route not found in the application', 404, null);
        res.status(404).send(apiResponse);

    } // end not found handler

module.exports = {
    globalErrorHandler: erroHandler,
    globalNotFoundHandler: notFoundHandler
}
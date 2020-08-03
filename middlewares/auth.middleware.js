/* Const Library */
const logger = require('./../libs/logger.libs')
const response = require('./../libs/response.libs')
const check = require('./../libs/check.libs')

let isAuthenticated = (req, res, next) => {
    if (req.params.authToken || req.query.authToken || req.header('authToken')) {
        if (req.params.authToken == "alphawhitewolf" || req.query.authToken == "alphawhitewolf" || req.header('authToken') == "alphawhitewolf") {
            req.user = { fullName: 'Admin', userId: 'alphawhitewolf' }
            next();
        } else {
            logger.error('Incorrect authentication token', 'Authentication Middleware', 5)
            let apiResponse = response.generate(true, 'Incorrect authentication token', 403, null)
            res.send(apiResponse)
        }
    } else {
        logger.error('Authentication Token Missing', 'Authentication Middleware', 5)
        let apiResponse = response.generate(true, 'Authentication Token Is Missing In Request', 403, null)
        res.send(apiResponse)
    }
}


module.exports = {
    isAuthenticated: isAuthenticated
}
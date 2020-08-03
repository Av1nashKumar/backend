let appConfig                = {};

appConfig.port               = 3000 ;
appConfig.allowedCrosOrigin  = "*"  ;
appConfig.env                = 'dev';
appConfig.db                 = {
    uri                      : 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false'
    // mongodb://Mongodb:@127.0.0.1:27017/blogAppDB'
}
appConfig.apiVersion         = '/api/v1';


module.exports = {

    port               : appConfig.port,
    allowedCrosOrigin  : appConfig.allowedCrosOrigin,
    env                : appConfig.env,
    db                 : appConfig.db,
    apiVersion         : appConfig.apiVersion

};//module export ends
angular.module('paysApp').factory('myHttpInterceptor', function($q,$rootScope) {
    return {
        // optional method
        'request': function(config) {
            // do something on success
            if(!/.html/.test(config.url) && !/.Pagination/.test(config.url)){
                //if(/.images/.test(config.url)){
                //  config.url = $rootScope.serverImagesURL + config.url;
                //}else {
                config.url = $rootScope.serverURL + config.url;
                //});
                if ($rootScope.credentials && $rootScope.credentials.token) {
                    config.headers['X-Auth-Token'] = $rootScope.credentials.token;
                } else {
                    config.headers['X-Auth-Token'] = "9F2490EC33584328A5E83991724C28AE";
                }
                console.log("NEW URL "+ config.url);
                console.log("HEADERS " + JSON.stringify(config.headers,null,4));
            }
            return config;
        },

        // optional method
        'response': function(response) {
            // do something on success
            return response;
        },

        // optional method
        'responseError': function(rejection) {
            // do something on error
            //if (canRecover(rejection)) {
            //  return responseOrNewPromise
            //}
            return $q.reject(rejection);
        }
    };
});

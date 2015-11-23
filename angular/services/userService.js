/**
 * Created by nignjatov on 20.11.2015.
 */
var UserService = angular.module('UserService', []).service('UserService',
    ["$rootScope","$q", "$http", function (rootScope,q, http) {

        /*-------------------------- USER OPERATIONS----------------------------*/
        this.registerUser = function (user) {
            var deffered = q.defer();
            http.post(rootScope.serverURL + "user",user).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("registerUser | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }
    }]);
/**
 * Created by nignjatov on 20.11.2015.
 */
var UserService = angular.module('UserService', []).service('UserService',
    ["$rootScope", "$q", "$http", "localStorageService", function (rootScope, q, http, localStorageService) {

        /*-------------------------- USER OPERATIONS----------------------------*/
        this.registerUser = function (user) {
            var deffered = q.defer();
            http.post(rootScope.serverURL + "user", user).
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

        this.storeUserData = function (token, id, role) {
            var keys = localStorageService.keys();
            for (var i = 0; i < keys.length; i++) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "credentials") {
                    localStorageService.remove(keys[i]);
                }
            }
            localStorageService.set(JSON.stringify(
                    {
                        type: "credentials",
                        role: role
                    }),
                {
                    token: token,
                    id: id
                });
        }

        this.logoutUser = function () {
            var keys = localStorageService.keys();
            for (var i = 0; i < keys.length; i++) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "credentials") {
                    localStorageService.remove(keys[i]);
                }
            }
        }

        this.getUserCredentials = function() {
            var keys = localStorageService.keys();
            for(var i=0;i<keys.length;i++){
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "credentials") {
                    return localStorageService.get(keys[i]);
                }
            }
        }

    }]);
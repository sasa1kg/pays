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

        this.storeUserCredentials = function (token, id, role) {
            if (localStorageService.cookie.isSupported) {
                localStorageService.cookie.clearAll();
                localStorageService.cookie.set("role",role,1);
                localStorageService.cookie.set("id",id,1);
                localStorageService.cookie.set("token",token,1);
            } else {
                console.error("Cookies not supported in this browser!");
            }
        }

        this.logoutUser = function () {
            if (localStorageService.cookie.isSupported) {
                return localStorageService.cookie.clearAll();
            } else {
                console.error("Cookies not supported in this browser!");
            }
        }

        this.getUserCredentials = function () {
            if (localStorageService.cookie.isSupported) {
                return {
                    role : localStorageService.cookie.get("role"),
                    id : localStorageService.cookie.get("id"),
                    token : localStorageService.cookie.get("token")
                }
            } else {
                console.error("Cookies not supported in this browser!");
            }
        }

    }]);
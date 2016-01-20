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

        this.getUserIdFromIDMId = function(idmId,role){
            var deffered = q.defer();
            http.get(rootScope.serverURL + "user/"+idmId+"/userForRole/"+role).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getUserIdFromIDMId | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getUserData = function(userId){
            var deffered = q.defer();
            http.get(rootScope.serverURL + "client/"+userId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getUserData | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.sendForgotPasswordEmail = function(destEmailData){
            var deffered = q.defer();
            http.post(rootScope.serverURL + "passwordChangeToken", destEmailData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("sendForgotPasswordEmail | Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("sendForgotPasswordEmail | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.resetPassword = function(newPassData){
            var deffered = q.defer();
            http.post(rootScope.serverURL + "resetPassword", newPassData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("resetPassword | Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("resetPassword | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.activateUser = function(token){
            var deffered = q.defer();
            http.get(rootScope.serverURL + "confirmUser/"+token).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("activateUser | Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("activateUser | Error " + status);
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
                return null;
            }
        }

    }]);
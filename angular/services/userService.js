/**
 * Created by nignjatov on 20.11.2015.
 */
var UserService = angular.module('UserService', []).service('UserService',
  ["$rootScope", "$q", "$http", "localStorageService", function (rootScope, q, http, localStorageService) {

    /*-------------------------- USER OPERATIONS----------------------------*/
    this.registerUser = function (user) {
      var deffered = q.defer();
      http.post("user", user).
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

    this.getUserIdFromIDMId = function (idmId, role) {
      var deffered = q.defer();
      http.get("user/" + idmId + "/userForRole/" + role).
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

    this.getUserData = function (userId) {
      var deffered = q.defer();
      http.get("client/" + userId).
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

    this.getUserPreviousDeliveryAddress = function (userId) {
      var deffered = q.defer();
      http.get("client/" + userId + "/previousDelivery").
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("getUserPreviousDeliveryAddress | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("getUserPreviousDeliveryAddress | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.sendForgotPasswordEmail = function (destEmailData) {
      var deffered = q.defer();
      http.post("passwordChangeToken", destEmailData).
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

    this.resetPassword = function (newPassData) {
      var deffered = q.defer();
      http.post("resetPassword", newPassData).
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

    this.activateUser = function (token) {
      var deffered = q.defer();
      http.get("confirmUser/" + token).
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

    this.updateBuyerGeneralInfo = function (buyerId, info) {
      var deffered = q.defer();

      http.put("client/" + buyerId, info).
        success(function (data, status) {
          if (status == 200) {
            console.log("updateBuyerGeneralInfo | Status OK " + status);
            deffered.resolve(data);
          } else {
            console.log("updateBuyerGeneralInfo | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("updateBuyerGeneralInfo | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.storeUserCredentials = function (token, id, role) {
      if (localStorageService.cookie.isSupported) {
        localStorageService.cookie.clearAll();
        localStorageService.cookie.set("role", role, 1);
        localStorageService.cookie.set("id", id, 1);
        localStorageService.cookie.set("token", token, 1);
      } else {
        console.error("Cookies not supported in this browser!");
      }
    }

    this.storeUserDeliveryAddresses = function (id, address) {
      if (localStorageService.cookie.isSupported) {
        localStorageService.cookie.set("addresses" + id, JSON.stringify(address), 1);
      } else {
        console.error("Cookies not supported in this browser!");
      }
    }

    this.getUserDeliveryAddress = function (id) {
      if (localStorageService.cookie.isSupported) {
        return localStorageService.cookie.get("addresses" + id);
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
          role: localStorageService.cookie.get("role"),
          id: localStorageService.cookie.get("id"),
          token: localStorageService.cookie.get("token")
        }
      } else {
        console.error("Cookies not supported in this browser!");
        return null;
      }
    }

    this.getDefaultLanguage = function () {
      var keys = localStorageService.keys();
      for (var i = keys.length - 1; i >= 0; i--) {
        var identifier = JSON.parse(keys[i]);
        if (identifier.type == "lang") {
          var lang = localStorageService.get(keys[i]);
          return lang.language;
        }
      }
      return null;
    }

    this.storeDefaultLanguage = function (langCode) {
      localStorageService.set(JSON.stringify(
        {
          "type": "lang",
        }
      ), {
        "language": langCode
      });
    }


    this.postOrderReview = function (clientId, orderId, reviewData) {
      var deffered = q.defer();
      http.post("client/" + clientId + "/orders/" + orderId + "/review", reviewData).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("postOrderReview | Status not OK " + status);
            deffered.reject("Error");
          }
        }).
        error(function (data, status) {
          console.log("postOrderReview | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }


  }]);
/**
 * Created by nignjatov on 27.11.2015.
 */
var OrderService = angular.module('OrderService', []).service('OrderService', ["$rootScope", "$q", "$http", "localStorageService",
    function (rootScope, q, http, localStorageService) {

        this.createOrder = function (order) {
            var deffered = q.defer();

            http.post(rootScope.serverURL + "order",order).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("createOrder | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("createOrder | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }
        this.getOrder = function (orderId) {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "order/"+orderId).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getOrder | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }
        this.createOrderItem = function (farmerId,clientId) {
            localStorageService.set(JSON.stringify(
                {
                    "type": "checkout",
                }
            ), {
                "farmerId": farmerId,
                "clientId": clientId,
                "items": [],
                "totalPrice" : "",
                "withTransport" : "",
                "transportPrice" : "",
                "address": "",
                "deliveryPeriod": {},
                "currency": rootScope.defaultCurrency
            });
        }

        this.saveAddress = function(isShipped,address,transportPrice,predefinedLocation) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.address = address;
                    localItem.withTransport = isShipped;
                    localItem.transportPrice = transportPrice;
                    localItem.predefinedLocation = predefinedLocation;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }

        this.saveItems = function(items, totalPrice){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.items = items;
                    localItem.totalPrice = totalPrice;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }
        this.saveFarmerTime = function(workHours){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.workHours = workHours;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }

        this.saveDeliveryPeriod = function(deliveryPeriod){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.deliveryPeriod = deliveryPeriod;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }

        this.saveClientId = function(clientId){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.clientId = clientId;
                    localStorageService.set(keys[i], localItem);
                }
            }
            return null;
        }

        this.getOrderData = function (){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    return localItem;
                }
            }
            return null;
        }

        this.clearOrderData = function (){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    localStorageService.remove(keys[i]);
                }
            }
        }
    }]);

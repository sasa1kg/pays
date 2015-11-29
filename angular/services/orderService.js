/**
 * Created by nignjatov on 27.11.2015.
 */
var OrderService = angular.module('OrderService', []).service('OrderService',  ["$rootScope","$q", "$http", function (rootScope,q, http) {

    this.createOrder = function (order) {
        var deffered = q.defer();

        http.post(rootScope.serverURL + "order").
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
}]);

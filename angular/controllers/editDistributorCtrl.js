/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$rootScope","$http", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService",
    function (scope, rootScope, http, filter, modal, routeParams, CartService, WishlistService, SearchService) {

        console.log("edit Distributor:  " + routeParams.id);

        scope.page = 'GENERAL_DISTRIBUTOR_DATA';

        scope.distributor = SearchService.getDistributorById(routeParams.id);

        scope.vehicles = SearchService.getVehiclesByDistributorId(routeParams.id);

        scope.price = CartService.getTotalCartAmount() + "";

        scope.prices = [];
//dummy load
        for (var i in rootScope.transportDistances){
            scope.prices[rootScope.transportDistances[i]] = [];
            for(var j in rootScope.transportWeights){
                scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = rootScope.transportDistances[i] * rootScope.transportWeights[j];
            }
        }
        scope.sectionChange = function (sectionName) {
            scope.page = sectionName;
        }
        scope.saveChanges = function () {
            console.log("Saving changes!");
        }

        scope.deleteVehicle = function (vehicle) {
            var idx = scope.vehicles.indexOf(vehicle);
            if (idx >= 0) {
                scope.vehicles.splice(idx, 1);
            }
        }

        scope.updateVehicle = function (vehicle) {
            scope.openVehicleModal(vehicle)
        }

        scope.addVehicle = function () {
            scope.openVehicleModal()
        }

        scope. updatePrices = function(){
            console.log(scope.prices);
        }
        scope.openVehicleModal = function (vehicle) {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'vehicleEditModal.html',
                controller: 'EmptyCartModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    vehicles: function () {
                        return scope.vehicles;
                    },
                    vehicle: function () {
                        return vehicle;
                    }
                }
            });

            modalInstance.result.then(function (vehicleNew) {
                if (typeof vehicleNew !== 'undefined') {
                    for (var v in scope.vehicles) {
                        if (scope.vehicles[v].id == vehicleNew.id) {
                            scope.vehicles[v] = vehicleNew;
                        }
                    }
                }
            });
        };
    }]);

angular.module('paysApp').controller('EmptyCartModalInstanceCtrl', function ($scope, $filter, $modalInstance, vehicles, vehicle) {

    var newVehicle = false
    $scope.vehicleNew = $.extend({}, vehicle);
    if (typeof vehicle === 'undefined') {
        newVehicle = true;
    }

    $scope.saveChanges = function () {
        console.log($scope.vehicleNew);
        $scope.vehicleNew.cooled = stringToBoolean($scope.vehicleNew.cooled);
        if (newVehicle == true) {
            vehicles.push($scope.vehicleNew);
            $modalInstance.close();
        }
        $modalInstance.close($scope.vehicleNew);
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.isCooled = function (value) {
        if ($scope.vehicleNew.cooled == value) {
            return true;
        }
        return false;
    }

    stringToBoolean = function (string) {
        if (typeof string === 'string') {

            switch (string.toLowerCase().trim()) {
                case "true":
                case "yes":
                case "1":
                    return true;
                case "false":
                case "no":
                case "0":
                case null:
                    return false;
                default:
                    return Boolean(string);
            }
        }
        return string;
    }
})
;
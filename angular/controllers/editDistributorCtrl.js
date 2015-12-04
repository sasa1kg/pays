/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$rootScope","$http", "$filter", "$modal", "$routeParams",
    "CartService", "WishlistService", "SearchService", "DistributorService","Notification",
    function (scope, rootScope, http, filter, modal, routeParams, CartService, WishlistService, SearchService,DistributorService,Notification) {


        var distributorId = routeParams.id;
        console.log("edit Distributor:  " + distributorId);

        scope.page = 'GENERAL_DISTRIBUTOR_DATA';
        scope.vehicles = [];
        DistributorService.getDistributorById(distributorId).then(function(data){
            scope.distributor = data;
        });

        DistributorService.getVehiclesByDistributorId(distributorId).then(function(data){
            scope.vehicles = data;
        });

        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

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
            DistributorService.deleteVehicle(distributorId,vehicle.id).then(function (data){
                Notification.success({message: filter('translate')('VEHICLE_DELETED')});
                var idx = scope.vehicles.indexOf(vehicle);
                if (idx >= 0) {
                    scope.vehicles.splice(idx, 1);
                }
            }).catch(function (data){
                Notification.error({message: filter('translate')('VEHICLE_NOT_DELETED')});
            });

        }

        scope.updateVehicle = function (vehicle) {
            scope.openVehicleModal(vehicle)
        }

        scope.addVehicle = function () {
            scope.openVehicleModal()
        }

        scope.updatePrices = function(){
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
                    var found = false;
                    for (var v in scope.vehicles) {
                        if (scope.vehicles[v].id == vehicleNew.id) {
                            found = true;
                            DistributorService.updateVehicle(distributorId,vehicleNew).then(function(){
                                Notification.success({message: "Vehicle updated!"});
                                scope.vehicles[v] = vehicleNew;
                            }).catch(function(){
                                Notification.error({message: "Unable to update vehicle!"});
                            });
                        }
                    }
                    if(found == false){
                        DistributorService.addNewVehicle(distributorId,vehicleNew).then(function(){
                            Notification.success({message: "New vehicle added!"});
                            scope.vehicles.push(vehicleNew);
                        }).catch(function(){
                            Notification.error({message: "Unable to add new vehicle!"});
                        });
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
            $modalInstance.close($scope.vehicleNew);
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
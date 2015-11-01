/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$http", "$filter","$modal", "$routeParams", "CartService", "WishlistService", "SearchService",
    function (scope, http, filter,modal, routeParams, CartService, WishlistService, SearchService) {

        console.log("edit Distributor:  " + routeParams.id);

        scope.page = 'VEHICLES';

        scope.distributor = SearchService.getDistributorById(routeParams.id);

        scope.vehicles = SearchService.getVehiclesByDistributorId(routeParams.id);

        scope.price = CartService.getTotalCartAmount()+"";

        scope.sectionChange = function(sectionName){
            scope.page = sectionName;
        }

        scope.saveChanges = function(){
            console.log("Saving changes!");
        }

        scope.deleteVehicle = function(vehicle){
            var idx = scope.vehicles.indexOf(vehicle);
            if (idx >= 0) {
                scope.vehicles.splice(idx, 1);
            }
        }

        scope.updateVehicle = function(vehicle){
            scope.openVehicleModal(vehicle)
        }

        scope.addVehicle = function(){
            scope.openVehicleModal()
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

angular.module('paysApp').controller('EmptyCartModalInstanceCtrl', function ($scope, $modalInstance,vehicles,vehicle) {

    var newVehicle = false
    $scope.vehicleNew = $.extend( {}, vehicle);
    if(typeof vehicle === 'undefined'){
        newVehicle = true;
    }

    $scope.saveChanges = function(){
        console.log($scope.vehicleNew);
        if(newVehicle == true) {
            vehicles.push($scope.vehicleNew);
            $modalInstance.close();
        }
        $modalInstance.close($scope.vehicleNew);
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.isCooled = function (value){
        if($scope.vehicleNew.cooled == value){
            return true;
        }
        return false;
    }
});
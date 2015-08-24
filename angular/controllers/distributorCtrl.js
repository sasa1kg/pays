angular.module('paysApp').controller("distributorCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService",
    function (scope, http, filter, routeParams, CartService, WishlistService, SearchService) {

        console.log("Distributor:  ".concat(routeParams.id));


        scope.distributor = SearchService.getDistributorById(routeParams.id);
        scope.distributorVehicles = SearchService.getVehiclesByDistributorId(routeParams.id);

    }]);
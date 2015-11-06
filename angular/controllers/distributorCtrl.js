angular.module('paysApp').controller("distributorCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService",
    function (scope, http, filter, routeParams, CartService, WishlistService, SearchService) {

        console.log("Distributor:  " + (routeParams.id));


        scope.distributor = SearchService.getDistributorById(routeParams.id);
        scope.distributorVehicles = SearchService.getVehiclesByDistributorId(routeParams.id);
        scope.price = CartService.getTotalCartAmount()+"";

        scope.wishlistItemsSize = WishlistService.getItemsSize();
    }]);
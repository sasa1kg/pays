angular.module('paysApp').controller("distributorCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService","DistributorService",
    function (scope, http, filter, routeParams, CartService, WishlistService, SearchService,DistributorService) {

        console.log("Distributor:  " + (routeParams.id));


        DistributorService.getDistributorById(routeParams.id).then(function(data){
            scope.distributor = data;
        });

        DistributorService.getVehiclesByDistributorId(routeParams.id).then(function(data){
            scope.distributorVehicles = data;
        });
        scope.price = CartService.getTotalCartAmount()+"";

        scope.wishlistItemsSize = WishlistService.getItemsSize();
    }]);
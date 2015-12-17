angular.module('paysApp').controller("distributorCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService", "DistributorService",
    function (scope, http, filter, routeParams, CartService, WishlistService, SearchService, DistributorService) {

        console.log("Distributor:  " + (routeParams.id));


        DistributorService.getDistributorById(routeParams.id).then(function (data) {
            scope.distributor = data;
            DistributorService.getDistributorImage(0, 0).then(function (img) {
                scope.distributor.img = img.document_content;
            })
        });

        DistributorService.getVehiclesByDistributorId(routeParams.id).then(function (data) {
            scope.distributorVehicles = data;
            for (var j = 0; j < scope.distributorVehicles.length; j++) {
                DistributorService.getVehicleImage(scope.distributorVehicles[j].id, scope.distributorVehicles[j].images[0]).then(function (img) {
                    for (var i = 0; i < scope.distributorVehicles.length; i++) {
                        if (scope.distributorVehicles[i].id === img.index) {
                            scope.distributorVehicles[i].img = "data:"+img.type+";base64,"+img.document_content;
                        }
                    }
                });
            }
        });

        scope.price = CartService.getTotalCartAmount() + "";

        scope.wishlistItemsSize = WishlistService.getItemsSize();
    }]);
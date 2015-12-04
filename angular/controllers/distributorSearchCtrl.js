angular.module('paysApp').controller("distributorSearchCtrl", ["$scope", "$rootScope", "$http", "$filter", "$routeParams","CartService","SearchService", "DistributorService","WishlistService",
    function (scope, rootScope, http, filter, routeParams,CartService,SearchService, DistributorService, WishlistService) {

        scope.distances = SearchService.getDistances();

        scope.foundDistributors = [];

        scope.locationValue = "";
        scope.pricePerKm = "";

        scope.searchName = "";
        scope.currency = "";
        scope.maxLoad = "";
        scope.loadMeasure = "";
        scope.distanceValue = "";

        scope.cancelSearch = function () {
            console.log("Search configuration canceled.");
            scope.foundDistributors = [];
        };

        scope.setSearchPrepared = function () {
            DistributorService.getDistributors().then(function(data){
                scope.foundDistributors = data;
                for (var j = 0; j < scope.foundDistributors.length; j++) {
                    DistributorService.getDistributorImage(scope.foundDistributors[j].id, 0).then(function (img) {
                        for (var i = 0; i < scope.foundDistributors.length; i++) {
                            if (scope.foundDistributors[i].id === img.index) {
                                scope.foundDistributors[i].img = img.document_content;
                            }
                        }
                    });
                }
            });
        };

        scope.clearSelectedSearchProducts = function () {
            scope.foundDistributors = [];
            scope.pricePerKm = "";
            scope.maxLoad = "";
            scope.locationValue = "";
            scope.distanceValue = "";
        }

        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();
    }]);
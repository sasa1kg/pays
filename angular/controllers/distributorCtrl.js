angular.module('paysApp').controller("distributorCtrl", ["$scope", "$rootScope", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService", "DistributorService",
  function (scope, rootScope, filter, routeParams, CartService, WishlistService, SearchService, DistributorService) {

    console.log("Distributor:  " + (routeParams.id));

    scope.prices = [];

    DistributorService.getPrices(routeParams.id).then(function (data) {
      angular.forEach(data.prices, function (price) {
        if (!scope.prices[price.distance]) {
          scope.prices[price.distance] = new Array();
          scope.prices[price.distance][price.weight] = price.price;
        } else {
          scope.prices[price.distance][price.weight] = price.price;
        }
      });
    });
    DistributorService.getDistributorById(routeParams.id).then(function (data) {
      scope.distributor              = data;
      scope.distributor.bannerImages = [];
      var bannerPicIndex             = 0;
      for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.distributor.images.banner.length)); i++) {
        DistributorService.getDistributorImage(routeParams.id, scope.distributor.images.banner[scope.distributor.images.banner.length - i])
          .then(function (img) {
            scope.distributor.bannerImages[bannerPicIndex++] = "data:image/jpeg;base64," + img.document_content;
          });
      }

    });

    DistributorService.getVehiclesByDistributorId(routeParams.id).then(function (data) {
      scope.distributorVehicles = data;
      for (var j = 0; j < scope.distributorVehicles.length; j++) {
        if (scope.distributorVehicles[j].images != null) {
          DistributorService.getVehicleImage(scope.distributorVehicles[j].id, scope.distributorVehicles[j].images).then(function (img) {
            for (var i = 0; i < scope.distributorVehicles.length; i++) {
              if (scope.distributorVehicles[i].id === img.index) {
                scope.distributorVehicles[i].img = "data:image/jpeg;base64," + img.document_content;
              }
            }
          });
        }
      }
    });


  }])
;
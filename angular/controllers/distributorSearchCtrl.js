angular.module('paysApp').controller("distributorSearchCtrl", ["$scope", "$rootScope", "$http", "$filter", "$routeParams", "CartService", "SearchService", "DistributorService", "WishlistService",
  function (scope, rootScope, http, filter, routeParams, CartService, SearchService, DistributorService, WishlistService) {

    scope.distances = SearchService.getDistances();

    scope.foundDistributors = [];

    scope.queryParams = {
      searchName: "",
      locationValue: "",
      distanceValue: "",
      pricePerKm: "",
      maxLoad: "",
      currency: "",
      loadMeasure: ""
    }

    scope.cancelSearch = function () {
      console.log("Search configuration canceled.");
      scope.foundDistributors = [];
    };

    scope.setSearchPrepared = function () {
      scope.queryParams.currency    = rootScope.getCurrencyObjectFromCode(scope.queryParams.currency);
      scope.queryParams.loadMeasure = rootScope.getMeasureUnitObjectFromCode(scope.queryParams.loadMeasure);
      DistributorService.getDistributors().then(function (data) {
        scope.foundDistributors = data;
        for (var j = 0; j < scope.foundDistributors.length; j++) {
          if (scope.foundDistributors[j].images.profile != null) {
            DistributorService.getDistributorImage(scope.foundDistributors[j].id, scope.foundDistributors[j].images.profile).then(function (img) {
              for (var i = 0; i < scope.foundDistributors.length; i++) {
                if (scope.foundDistributors[i].id === img.index) {
                  scope.foundDistributors[i].img = "data:image/jpeg;base64," + img.document_content;
                }
              }
            });
          }
        }
      });
    };

    scope.clearSelectedSearchProducts = function () {
      scope.foundDistributors = [];
      scope.pricePerKm        = "";
      scope.maxLoad           = "";
      scope.locationValue     = "";
      scope.distanceValue     = "";
    }

    scope.searchNameCallback = function (keyEvent) {
      if (keyEvent.which === 13) {
        scope.setSearchPrepared();
      }
    }
  }]);
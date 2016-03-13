angular.module('paysApp').controller("distributorSearchCtrl", ["$scope", "$rootScope", "$http", "$filter", "$routeParams", "CartService", "SearchService", "DistributorService", "WishlistService",
    function (scope, rootScope, http, filter, routeParams, CartService, SearchService, DistributorService, WishlistService) {

        scope.distances = SearchService.getDistances();

        scope.searchPerformed = false;
        scope.allDistributors = [];
        scope.foundDistributors = [];

        scope.distributorsNamesArray = [];

        scope.queryParams = {};

        scope.cancelSearch = function () {
            console.log("Search configuration canceled.");
            scope.foundDistributors = [];
            scope.queryParams = {};
            scope.searchPerformed = false;
        };

        DistributorService.getDistributors().then(function (data) {
            scope.allDistributors = data;
            for (var j = 0; j < scope.allDistributors.length; j++) {
                if ((scope.allDistributors[j].isConfirmed == true) && (scope.allDistributors[j].isActive == true)) {

                    var name = scope.allDistributors[j].businessSubject.name;
                    var firstLetter = null;
                    var distributorName = null;
                    if (name != null && name.length > 0) {
                        firstLetter = name[0].toUpperCase();
                    }
                    for (var k = 0; k < scope.distributorsNamesArray.length; k++) {
                        if (scope.distributorsNamesArray[k].letter == firstLetter) {
                            distributorName = scope.distributorsNamesArray[k];
                        }
                    }
                    if (distributorName == null) {
                        var item = {
                            letter: firstLetter,
                            distributors: []
                        };
                        item.distributors.push(scope.allDistributors[j]);
                        scope.distributorsNamesArray.push(item);
                    } else {
                        distributorName.distributors.push(scope.allDistributors[j]);
                    }
                    if (scope.allDistributors[j].images.profile != null) {
                        DistributorService.getDistributorImage(scope.allDistributors[j].id, scope.allDistributors[j].images.profile).then(function (img) {
                            for (var i = 0; i < scope.allDistributors.length; i++) {
                                if (scope.allDistributors[i].id === img.index) {
                                    scope.allDistributors[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                    }
                }
            }
        });

        scope.setSearchPrepared = function () {
            scope.searchPerformed = true;
            scope.queryParams.name = (scope.queryParams.name != null && scope.queryParams.name.length > 0) ? scope.queryParams.name : null;
            scope.queryParams.city = (scope.queryParams.city != null && scope.queryParams.city.length > 0) ? scope.queryParams.city : null;
            scope.queryParams.weight = (scope.queryParams.weight != null) ? scope.queryParams.weight : null;
            DistributorService.searchDistributors(scope.queryParams).then(function (data) {
                scope.foundDistributors = data;
                for (var j = 0; j < scope.foundDistributors.length; j++) {
                    if (scope.foundDistributors[j].images.profile != null) {
                        DistributorService.getDistributorImage(scope.foundDistributors[j].id, scope.allDistributors[j].images.profile).then(function (img) {
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
            scope.queryParams = {};
            scope.searchPerformed = false;
        }

        scope.searchNameCallback = function (keyEvent) {
            if (keyEvent.which === 13) {
                scope.setSearchPrepared();
            }
        }
    }])
;
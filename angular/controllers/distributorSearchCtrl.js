angular.module('paysApp').controller("distributorSearchCtrl", ["$scope", "$rootScope", "$http", "$filter", "$routeParams", "CartService", "SearchService", "DistributorService", "WishlistService",
    function (scope, rootScope, http, filter, routeParams, CartService, SearchService, DistributorService, WishlistService) {

        scope.distances = SearchService.getDistances();

        scope.allDistributors = [];
        scope.foundDistributors = [];

        scope.distributorsNamesArray = [];

        //create array from A to Z
        //for(var i = 65;i<=90;i++){
        //    scope.distributorsNamesArray.push({
        //        letter : String.fromCharCode(i),
        //        distributors : []
        //    });
        //}
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

                    console.log(scope.distributorsNamesArray);
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
            scope.queryParams.currency = rootScope.getCurrencyObjectFromCode(scope.queryParams.currency);
            scope.queryParams.loadMeasure = rootScope.getMeasureUnitObjectFromCode(scope.queryParams.loadMeasure);
            DistributorService.getDistributors().then(function (data) {
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
            scope.pricePerKm = "";
            scope.maxLoad = "";
            scope.locationValue = "";
            scope.distanceValue = "";
        }

        scope.searchNameCallback = function (keyEvent) {
            if (keyEvent.which === 13) {
                scope.setSearchPrepared();
            }
        }
    }])
;
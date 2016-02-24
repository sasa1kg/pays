angular.module('paysApp').controller("mainCtrl", ["$scope", "$sce", "$document", "$http", "$filter", "$location", "localStorageService",
    "GeoLocationService", "CartService", "WishlistService", "SearchService","FarmerService",
    function (scope, $sce, $document, http, filter, location, localStorageService, GeoLocationService, CartService, WishlistService, SearchService, FarmerService) {


        console.log("Main Ctrl!");

        scope.checkedValue = "";
        scope.geoLoc = null;
        scope.geoLocSearch = null;
        scope.gmapsLocLink = "";

        scope.searchWishlistItems = [];
        scope.categories = [];
        scope.selectedCategories = [];

        scope.foundProducts = [];
        scope.foundFarmers = [];

        scope.searchName = "";
        scope.searchPlace = "";
        scope.locationFound = false;

        scope.queryParams = {
            searchName : "",
            searchPlace : "",
            distanceValue: "",
            products : {
                product : {},
                minAmount : "",
                maxPrice: ""
            }
        }
        scope.initGeo = function () {
            GeoLocationService.getLocation().then(function (data) {
                if (data) {
                    scope.geoLoc = GeoLocationService.getGeoLoc();

                    scope.gmapsLocLink = "https://www.google.rs/maps/place/" + scope.geoLoc.lat + "," + scope.geoLoc.lng;
                } else {
                    scope.geoLoc = null;
                }
            });
        }

        scope.locationDefined = function () {
            if (scope.geoLoc == null) {
                return false;
            } else {
                return true;
            }
        }
        
        scope.searchPlaceBlur = function () {
            if (scope.searchPlaceValue.length > 0) {
                scope.locationFound = false;
                console.log("search place " + scope.searchPlaceValue);
                GeoLocationService.findGeoLoc(scope.searchPlaceValue).then(function (data) {

                    console.log("Ctrl res " + JSON.stringify(data));
                    scope.geoLocSearch = data;
                    scope.locationFound = true;
                    scope.gmapsLocLink = "https://www.google.rs/maps/place/" + data.lat + "," + data.lng;

                }, function (error) {
                    console.log("Ctrl res null");
                    scope.locationFound = false;
                    scope.geoLoc = null;
                    scope.geoLocSearch = null;
                    scope.locationDefined();
                });
            }
        }

        scope.farmers = [];

        scope.nearByFarmers = GeoLocationService.testPromise().then(function (data) {

            scope.farmers = scope.farmersLoaded;

        }, function (error) {

        });


        scope.changeSearchMode = function () {
            scope.geoLoc = null;
            scope.locationFound = false;
            scope.locationDefined();
        };

        scope.clearSearch = function () {
            scope.searchPlaceValue = "";
            scope.geoLoc = null;
            scope.locationFound = false;
            scope.locationDefined();
        };


        scope.categoryId = "";
        scope.subcategoryId = "";
        scope.subcatProductId = "";

        scope.subcategories = [];
        scope.subcatproducts = [];
        scope.getCategories = SearchService.getCategories().then(function (data) {
            if (data) {
                scope.categories = data;
            } else {
                console.log("Unable to retrieve categories from DB");
            }

        });


        scope.setSearchPrepared = function () {
            SearchService.setSearchedItems(scope.searchWishlistItems);
            SearchService.getFarmers().then(function (data) {
                if (data) {
                    scope.foundFarmers = data;
                    for (var j = 0; j < scope.foundFarmers.length; j++) {
                        FarmerService.getFarmerImage(scope.foundFarmers[j].id,scope.foundFarmers[j].images.profile).then(function (img) {
                            for (var i = 0; i < scope.foundFarmers.length; i++) {
                                if (scope.foundFarmers[i].id === img.index) {
                                    scope.foundFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                    }
                }
                else {
                    console.log("Unable to load farmers from DB");
                }
            });
        };
        scope.cancelSearch = function () {
            console.log("Search configuration canceled.");
            scope.foundFarmers = [];
        };


        scope.isWishListEmpty = function () {
            return typeof scope.searchWishlistItems[0] === 'undefined' || scope.searchWishlistItems.length == 0;
        };

        scope.noSelectedCategory = function () {
            return typeof scope.selectedCategories[0] === 'undefined' || scope.selectedCategories.length == 0;
        }

        scope.noFoundFarmers = function () {
            console.log("no selected farmers? ".concat(typeof scope.foundFarmers[0] === 'undefined' || scope.foundFarmers.length == 0));
            return typeof scope.foundFarmers[0] === 'undefined' || scope.foundFarmers.length == 0;
        }

        scope.check = function (category) {
            console.log(category.checkedValue);
            if (!category.checkedValue) {
                SearchService.getProductsInCategory(category.id).then(function (data) {
                    if (data) {
                        var products = data.products;
                        scope.selectedCategories.splice(scope.selectedCategories.indexOf(category), 1);
                        for (var j = products.length - 1; j >= 0; j--) {
                            for (var k = scope.foundProducts.length - 1; k >= 0; k--) {
                                if (scope.foundProducts[k].id == products[j].id) {
                                    scope.foundProducts.splice(k, 1);
                                    break;
                                }
                            }
                        }
                    } else {
                        console.log("Unable to retrieve category products from DB");
                    }
                });
            }
            if (category.checkedValue) {
                SearchService.getProductsInCategory(category.id).then(function (data) {
                    if (data) {
                        scope.selectedCategories.push(category);
                        var products = data.products;
                        for (var j = products.length - 1; j >= 0; j--) {
                            products[j].checked = false;
                            if (products[j].checked == false) {
                                for (var k = scope.searchWishlistItems.length - 1; k >= 0; k--) {
                                    if (scope.searchWishlistItems[k].id == products[j].id) {
                                        products[j].checked = true;
                                    }
                                }
                            }

                            scope.foundProducts.push(products[j]);
                        }
                    } else {
                        console.log("Unable to retrieve category products from DB");
                    }
                });
            }
        }


        scope.addOrRemoveSearchWishlistItem = function (product) {

            if (product.checked) {
                var prodFound = false;
                for (var prod in scope.searchWishlistItems) {
                    if (prod.id == product.id) {
                        prodFound = true;
                    }
                }

                if (prodFound == false) {
                    console.log("Adding product ".concat(product.name));
                    scope.searchWishlistItems.push(product);
                }
            } else {
                console.log("Removing product ".concat(product.name));
                var idx = scope.searchWishlistItems.indexOf(product);
                if (idx >= 0) {
                    scope.searchWishlistItems.splice(idx, 1);
                }
            }
        }

        scope.clearSelectedSearchProducts = function () {
            scope.searchWishlistItems = [];
            scope.selectedCategories = [];
            scope.foundProducts = [];
            scope.foundFarmers = [];
        }
        scope.distance = "";

        scope.getLocation = function () {
            if (scope.geoLoc != null) {
                return {
                    "distance": scope.distance,
                    "name": "YOUR_LOC",
                    "longitude": scope.geoLoc.lng,
                    "latitude": scope.geoLoc.lat
                };
            } else if (scope.geoLocSearch != null) {
                return {
                    "distance": scope.distance,
                    "name": scope.searchPlaceValue,
                    "longitude": scope.geoLocSearch.lng,
                    "latitude": scope.geoLocSearch.lat
                };
            } else {
                return {
                    "distance": "",
                    "name": "",
                    "longitude": "",
                    "latitude": ""
                };
            }
        };

//INIT FUNCTIONS
//        scope.initGeo();
        SearchService.getFarmers().then(function (data) {
            if (data) {
                scope.farmersLoaded = data;
                for (var j = 0; j < scope.farmersLoaded.length; j++) {
                    if (scope.farmersLoaded[j].images.profile != null) {
                        FarmerService.getFarmerImage(scope.farmersLoaded[j].id, scope.farmersLoaded[j].images.profile).then(function (img) {
                            for (var i = 0; i < scope.farmersLoaded.length; i++) {
                                if (scope.farmersLoaded[i].id === img.index) {
                                    scope.farmersLoaded[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                    }
                }
            }
            else {
                console.log("Unable to load farmers from DB");
            }
        });

        SearchService.getMostProfitFarmers().then(function (data) {
            scope.mostProfitFarmers = data;
            for (var j = 0; j < scope.mostProfitFarmers.length; j++) {
                if (scope.mostProfitFarmers[j].imageId != null) {
                    FarmerService.getFarmerImage(scope.mostProfitFarmers[j].merchantId, scope.mostProfitFarmers[j].imageId).then(function (img) {
                        for (var i = 0; i < scope.mostProfitFarmers.length; i++) {
                            if (scope.mostProfitFarmers[i].merchantId === img.index) {
                                scope.mostProfitFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                }
            }
        });

        SearchService.getMostOrdersFarmers().then(function (data) {
            scope.mostProductsFarmers = data;
            for (var j = 0; j < scope.mostProductsFarmers.length; j++) {
                if (scope.mostProductsFarmers[j].imageId != null) {
                    FarmerService.getFarmerImage(scope.mostProductsFarmers[j].merchantId, scope.mostProductsFarmers[j].imageId).then(function (img) {
                        for (var i = 0; i < scope.mostProductsFarmers.length; i++) {
                            if (scope.mostProductsFarmers[i].merchantId === img.index) {
                                scope.mostProductsFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                }
            }
        });

        SearchService.getMostProductsFarmers().then(function (data) {
            scope.mostOrdersFarmers = data;
            for (var j = 0; j < scope.mostOrdersFarmers.length; j++) {
                if (scope.mostOrdersFarmers[j].imageId != null) {
                    FarmerService.getFarmerImage(scope.mostOrdersFarmers[j].merchantId, scope.mostOrdersFarmers[j].imageId).then(function (img) {
                        for (var i = 0; i < scope.mostOrdersFarmers.length; i++) {
                            if (scope.mostOrdersFarmers[i].merchantId === img.index) {
                                scope.mostOrdersFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                }
            }
        });
        scope.searchNameCallback = function(keyEvent) {
            if (keyEvent.which === 13){
                scope.setSearchPrepared();
            }
        }

        scope.distances = SearchService.getDistances();
    }])
;
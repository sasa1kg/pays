angular.module('paysApp').controller("mainCtrl", ["$scope", "$sce", "$document", "$http", "$filter", "$location", "localStorageService",
    "GeoLocationService", "CartService", "WishlistService", "SearchService",
    function (scope, $sce, $document, http, filter, location, localStorageService, GeoLocationService, CartService, WishlistService, SearchService) {


        console.log("Main Ctrl!");
        scope.msg = "Main Ctrl!";

        scope.checkedValue = "";
        scope.geoLoc = null;
        scope.geoLocSearch = null;
        scope.gmapsLocLink = "";

        scope.searchWishlistItems = [];
        scope.categories = [];
        scope.selectedCategories = [];

        scope.foundProducts = [];
        scope.foundFarmers = [];

        scope.getCarts = function () {
            scope.cartItems = CartService.getItemsSize();
            scope.wishlistItems = WishlistService.getItemsSize();
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


        scope.putInCart = function (key, value) {
            CartService.putInCart(key, value);
            scope.cartItems = CartService.getItemsSize();
        };


        scope.farmersLoaded = SearchService.getFarmers();

        scope.searchPlaceValue = "";
        scope.locationFound = false;
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


        scope.addCriteria = function (category, subcategory, product, maxPrice, minQuantity) {
            var categoryName = "";
            var subCategoryName = "";
            var productName = "";
            for (var i = scope.categories.length - 1; i >= 0; i--) {
                if (scope.categories[i].id == category) {
                    categoryName = scope.categories[i].name;
                }
            }
            ;

            for (var j = scope.subcategories.length - 1; j >= 0; j--) {
                if (scope.subcategories[j].id == subcategory) {
                    subCategoryName = scope.subcategories[j].name;
                }
            }
            ;
            for (var k = scope.subcatproducts.length - 1; k >= 0; k--) {
                if (scope.subcatproducts[k].id == product) {
                    productName = scope.subcatproducts[k].name;
                }
            }
            ;

            alert(counter + "   " + categoryName + "   " + subCategoryName + "  " + productName);
            var criteria = {
                "id": counter,
                "category": categoryName,
                "subcategory": subCategoryName,
                "product": productName,
                "maxPrice": maxPrice,
                "minQuantity": minQuantity
            };
            scope.searchCriterias.push(criteria);
            scope.maxPrice = 2500;
            scope.minQuantity = 250;
            counter++;
        }
        scope.removeCriteria = function (id) {
            for (var i = scope.searchCriterias.length - 1; i >= 0; i--) {
                if (scope.searchCriterias[i].id === id) {
                    var index = scope.searchCriterias.indexOf(scope.searchCriterias[i]);
                    scope.searchCriterias.splice(index, 1);
                }
            }
            ;
        }

        scope.searchCriterias = [];
        scope.maxPrice = 2500;
        scope.minQuantity = 250;


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
        scope.getCategories = function () {
            scope.categories = SearchService.getCategories();
        };
        scope.getSubcategories = function (catId) {
            scope.subcategories = SearchService.getSubcategories(catId);
        };
        scope.getSubCatProducts = function (catId, subcatId) {
            alert(catId + " " + subcatId);
            scope.subcatproducts = SearchService.getProductsInSubcategory(catId, subcatId);
        };

        scope.changedCat = function () {
            scope.subcategoryId = "";
            scope.subcatProductId = "";
            scope.subcatProductId = "";
            scope.subcatproducts = [];
            scope.subcatproducts.length = 0;
            scope.getSubcategories(scope.categoryId);
            scope.getSubCatProducts(scope.categoryId, scope.subcategoryId);
        };
        scope.changedSubCat = function () {
            scope.getSubCatProducts(scope.categoryId, scope.subcategoryId);
        }
        scope.changedSubCatProd = function () {

        }

        scope.setSearchPrepared = function () {
            /*	if (scope.locationDefined && !scope.locationFound) {
             var location = {
             "name" : "YOUR_LOC",
             "longitude" : scope.geoLoc.lng,
             "latitude" : scope.geoLoc.lat
             };
             } else {
             if (!scope.locationDefined && scope.locationFound) {
             var location = {
             "name" : scope.searchPlaceValue,
             "longitude" : scope.geoLocSearch.lng,
             "latitude" : scope.geoLocSearch.lat
             };
             } else {
             var location = {
             "name" : "",
             "longitude" : "",
             "latitude" : ""
             };
             }
             }
             if (scope.geoLoc != null) {
             var location = {
             "name" : "YOUR_LOC",
             "longitude" : scope.geoLoc.lng,
             "latitude" : scope.geoLoc.lat
             };
             } else if (scope.geoLocSearch != null){
             var location = {
             "name" : scope.searchPlaceValue,
             "longitude" : scope.geoLocSearch.lng,
             "latitude" : scope.geoLocSearch.lat
             };
             } else {
             var location = {
             "name" : "",
             "longitude" : "",
             "latitude" : ""
             };
             }
             SearchService.setSearchObject(scope.getLocation(), [], true).then(function(data) {
             if (data) {
             location.path("/search");
             }
             });
             */
            scope.foundFarmers = scope.farmersLoaded;
            SearchService.setSearchedItems(scope.searchWishlistItems);
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

        scope.check = function (value, checked) {
            var idx = scope.selectedCategories.indexOf(value);
            if (idx >= 0 && !checked) {
                scope.selectedCategories.splice(idx, 1);
            }
            if (idx < 0 && checked) {
                scope.selectedCategories.push(value);
            }

            scope.foundProducts = [];
            for (var cat in scope.selectedCategories) {
                var products = SearchService.getProductsInCategory(scope.selectedCategories[cat]);
                for (var prod in products) {
                    scope.foundProducts.push(products[prod]);
                }
            }

        }

        scope.getProducts = function () {
            return scope.foundProducts;
        }

        scope.addOrRemoveSearchWishlistItem = function (product,checked) {

            if(checked) {
                var prodFound = false;
                for (var prod in scope.searchWishlistItems) {
                    if (prod == product.id) {
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
        scope.initGeo();
        scope.getCategories();
        scope.getCarts();
    }])
;
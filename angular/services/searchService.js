var SearchService = angular.module('SearchService', []).service('SearchService',
    ["$rootScope","$q", "$http", function (rootScope,q, http) {

        this.searchWishListItems = [];

        /*-------------------------- USER OPERATIONS----------------------------*/
        this.getCategories = function () {
            var deffered = q.defer();
            http.get(rootScope.serverURL  + "product_category_first").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getCategories | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getProductsInCategory = function (category) {
            console.log("Search category ".concat(category));
            var deffered = q.defer();
            http.get(rootScope.serverURL  + "product_category/" + category).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getProductsInCategory |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getFarmers = function () {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "merchant").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmers |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getFarmerById = function (id) {
            var deffered = q.defer();
            http.get(rootScope.serverURL  + "merchant/" + id).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerById |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getFarmerProducts = function (farmerId) {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "merchant/" + farmerId + "/products").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerProducts |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getCurrencies = function () {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "currency").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getCurrencies | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getCurrencies | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getMeasurementUnits = function () {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "measurement_unit").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getMeasurementUnits | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getMeasurementUnits | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getSearchedItems = function (farmerId) {
            return this.searchWishListItems;
        }

        this.setSearchedItems = function (items) {
            this.searchWishListItems = items;
        }

        this.getDistances = function () {
            return [
                {
                    value: "10 km"
                },
                {
                    value: "20 km"
                },
                {
                    value: "50 km"
                },
                {
                    value: "100 km"
                }
            ]
        }
    }]);
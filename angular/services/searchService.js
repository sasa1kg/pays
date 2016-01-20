var SearchService = angular.module('SearchService', []).service('SearchService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {

        this.searchWishListItems = [];

        /*-------------------------- USER OPERATIONS----------------------------*/
        this.getCategories = function () {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "product_category_first").
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
            http.get(rootScope.serverURL + "product_category/" + category).
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

        this.getAllProducts = function () {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "product").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getAllProducts|Status not OK " + status);
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
            http.get(rootScope.serverURL + "merchant/" + id).
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


        this.getFarmerImage = function (farmerId, imageId) {
            var deffered = q.defer();

            var imgData = {
                document_content: "data:image/jpeg;base64,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"
            };
            imgData.index = farmerId;
            deffered.resolve(imgData);
            // http.get(rootScope.serverURL  + "merchant/" + id+"/images/"+imageId+"imagefile").
            // http.get(rootScope.serverURL  + "product/1/images/10/imagefile").
            //     success(function (data, status) {
            //         if (status == 200) {
            //             deffered.resolve(data);
            //         } else {
            //             console.log("getFarmerById |Status not OK " + status);
            //             deffered.reject("Error");
            //         }
            //
            //     }).
            //     error(function (data, status) {
            //         console.log("Error " + status);
            //         deffered.reject("Error");
            //     });

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
        this.getProductImage = function (productId,imageId) {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "product/" + productId + "/images/"+imageId+"/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
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

        this.getWishlistProductImage = function (productId,imageId,wishlistItemId) {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "product/" + productId + "/images/"+imageId+"/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        data.wishlistIndex = wishlistItemId;
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


        this.getFarmerOrders = function (farmerId) {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "merchant/" + farmerId + "/orders").
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

        this.getClientById = function (id) {
            var deffered = q.defer();
            http.get(rootScope.serverURL + "client/" + id).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getClientById |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }
    }]);


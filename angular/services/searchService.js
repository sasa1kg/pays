var SearchService = angular.module('SearchService', []).service('SearchService',
    ['localStorageService', "$q", "$http", function (localStorageService, q, http) {

        var serverurl = "http://185.23.171.43/PaysRest/";

        this.searchWishListItems = [];

        /*-------------------------- USER OPERATIONS----------------------------*/
        this.getCategories = function () {
            var deffered = q.defer();
            http.get(serverurl + "product_category_first").
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
            http.get(serverurl + "product_category/" + category).
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
            http.get(serverurl + "merchant").
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
            http.get(serverurl + "merchant/" + id).
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
            http.get(serverurl + "merchant/" + farmerId + "/products").
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

        this.getSearchedItems = function (farmerId) {
            return this.searchWishListItems;
        }

        this.setSearchedItems = function (items) {
            this.searchWishListItems = items;
        }


        this.getDistributorById = function (distributorId) {
            console.log(this.distributors[distributorId]);
            return this.distributors[distributorId];
        }

        this.getVehiclesByDistributorId = function (distId) {
            return this.vehicles;
        }

        this.distributors = [
            {
                "id": 0,
                generalInfo : {
                    "companyName": "Kurir d.o.o",
                    "accountNumber": "123213-546212",
                    "pibNumber": "12471952",
                    "streetAndNr": "Novosadska 13",
                    "postalCode": "21000",
                    "city": "Novi Sad",
                    "phone": "+38162957194",
                },

                "img":" images/home/courier1.jpg",
                "message": "DISTRIBUTOR_MSG",
                "title": "DISTRIBUTOR_TITLE"
            },
            {
                "id": 1,
                generalInfo : {
                    "companyName": "Kombi prevoz",
                    "accountNumber": "1233263-99912",
                    "pibNumber": "19381952",
                    "streetAndNr": "Dunavska 55",
                    "postalCode": "33000",
                    "city": "Rumenka",
                    "phone": "+381626667194",
                },
                "img":" images/home/courier1.jpg",
                "message": "DISTRIBUTOR_MSG",
                "title": "DISTRIBUTOR_TITLE"

            }

        ];

        this.vehicles = [
            {
                "id": 0,
                "model": "Ford Transit",
                "number": 2,
                "cooled": true,
                "height": 120,
                "width": 150,
                "depth": 200,
                "amount": 500,
                "img":" images/home/vehicle1.jpg"
            },
            {
                "id": 1,
                "model": "Renault Courier",
                "number": 6,
                "cooled": false,
                "height": 160,
                "width": 140,
                "depth": 220,
                "amount": 730,
                "img":" images/home/vehicle2.jpg"
            },
            {
                "id": 2,
                "model": "Mercedes Transporter",
                "number": 9,
                "cooled": true,
                "height": 110,
                "width": 155,
                "depth": 250,
                "amount": 650,
                "img":" images/home/vehicle1.jpg"
            }
        ]

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
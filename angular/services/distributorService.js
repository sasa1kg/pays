/**
 * Created by nignjatov on 20.11.2015.
 */
var DistributorService = angular.module('DistributorService', []).service('DistributorService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {

        this.getDistributors = function () {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "transporter").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getDistributors | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getDistributors | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getDistributorById = function (distributorId) {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "transporter/" + distributorId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getDistributorById | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getDistributorById | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getVehiclesByDistributorId = function (distributorId) {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "transporter/" + distributorId + "/vehicles").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getVehiclesByDistributorId | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getVehiclesByDistributorId | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.addNewVehicle = function (distributorId,vehicle) {
            var deffered = q.defer();

            http.post(rootScope.serverURL + "transporter/" + distributorId + "/vehicles",vehicle).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("addNewVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("addNewVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.updateVehicle = function (distributorId,vehicle) {
            var deffered = q.defer();

            http.put(rootScope.serverURL + "transporter/" + distributorId + "/vehicles/"+vehicle.id,vehicle).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("updateVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.distributors = [
            {
                "id": 0,
                generalInfo: {
                    "companyName": "Kurir d.o.o",
                    "accountNumber": "123213-546212",
                    "pibNumber": "12471952",
                    "streetAndNr": "Novosadska 13",
                    "postalCode": "21000",
                    "city": "Novi Sad",
                    "phone": "+38162957194",
                },
                advertising: {
                    "img": " images/home/courier1.jpg",
                    "message": "Brza dostava svakog dana u svim velikim gradovima u Srbiji",
                    "title": "Najbolji distributor za Vas!",
                    banner: [
                        "images/home/courier1.jpg",
                        "images/home/courier2.jpg",
                        "images/home/courier3.jpg",
                        "images/home/courier4.jpg",
                        "images/home/courier5.jpg"
                    ]
                }
            },
            {
                "id": 1,
                generalInfo: {
                    "companyName": "Kombi prevoz",
                    "accountNumber": "1233263-99912",
                    "pibNumber": "19381952",
                    "streetAndNr": "Dunavska 55",
                    "postalCode": "33000",
                    "city": "Rumenka",
                    "phone": "+381626667194",
                },
                advertising: {
                    "img": " images/home/courier1.jpg",
                    "message": "Brza dostava svakog dana u svim velikim gradovima u Srbiji",
                    "title": "Najbolji distributor za Vas!",
                    banner: [
                        "images/home/courier1.jpg",
                        "images/home/courier2.jpg",
                        "images/home/courier3.jpg",
                        "images/home/courier4.jpg",
                        "images/home/courier5.jpg"
                    ]
                }
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
                "img": "images/home/vehicle1.jpg"
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
                "img": "images/home/vehicle2.jpg"
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
                "img": "images/home/vehicle1.jpg"
            }
        ]

    }]);
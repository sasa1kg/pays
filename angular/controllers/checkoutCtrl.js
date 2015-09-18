angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$http", "$filter", "CartService", function (scope, http, filter, CartService) {

    console.log("checkoutCtrl");
    scope.msg = "checkoutCtrl";

    scope.price = CartService.getTotalCartAmount() + "";

    scope.orderId = "123456";
    scope.amount = "84555.30";
    scope.currency = "RSD";

    scope.nameSurname = "";
    scope.predefLoc = "";

    scope.predefinedLocationString = "predefinedLocation";
    scope.cityString = "city";

    scope.city = "";
    scope.street = "";
    scope.number = "";
    scope.appartment = "";
    scope.floor = "";
    scope.entrance = "";
    scope.chosenAdress = "";

    scope.creditCard = "";
    scope.note = "";
    scope.cities = [
        {
            "id": 0,
            "name": "Novi Sad"
        },
        {
            "id": 1,
            "name": "Beograd"
        },
        {
            "id": 2,
            "name": "Kraljevo"
        }
    ]

    scope.addresses = [
        'Dositejeva 2',
        'Narodnog fronta 100',
        'Zmaj jovina 4',
        'Dunavska 63'
    ]

    scope.cards = [
        'American express',
        'Master Card',
        'Visa Electron'
    ]
    scope.executePayment = function () {
        console.log("NAME " + scope.nameSurname);
        console.log("PREDEF LOC " + scope.predefLoc);
        console.log("STREET " + scope.street);
        console.log("NUMBER " + scope.number);
        console.log("APPARTMENT " + scope.appartment);
        console.log("FLOOR " + scope.floor);
        console.log("ENTRANCE " + scope.entrance);
        console.log("CITY " + scope.city);
        //console.log("CHOSEN ADDRESS " + scope.chosenAdress);
        console.log("CREDIT CARD " + scope.creditCard);
        console.log("NOTE "+ scope.note);
    }

}]);
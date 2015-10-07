angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$http", "$filter", "CartService", function (scope, http, filter, CartService) {

    console.log("checkoutCtrl");
    scope.msg = "checkoutCtrl";

    scope.price = CartService.getTotalCartAmount() + "";

    scope.orderId = "123456";
    scope.amount = "84555.30";
    scope.currency = "RSD";

    scope.nameSurname = "";

    scope.note = "";

    scope.dateDropDownInput = "";

    scope.executePayment = function () {
        console.log("Payment Information!");
        console.log("Name " + scope.nameSurname);
        if (scope.locationType == scope.predefinedLocationString) {
            console.log("Delivery to predefined address : " + scope.chosenAddress);
        } else if (scope.locationType == scope.cityString) {
            console.log("Delivery to city : " + scope.city + " Street: " + scope.street + " Number: " + scope.number +
                " Appartment: "+ scope.appartment + " Floor: " + scope.floor + " Entrance: " + scope.entrance);
        } else {
            console.error("Unsupported location type!");
        }
        console.log("Delivery time: " + scope.dateDropDownInput);
        console.log("Credit card: " + scope.creditCard);
        console.log("Note: " + scope.note);
    }

    scope.changed = function (adr) {
        scope.chosenAddress = adr;
    }
}]);
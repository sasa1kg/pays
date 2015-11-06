angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$http", "$filter", "CartService","WishlistService", function (scope, http, filter, CartService,WishlistService) {

    console.log("checkoutCtrl");
    scope.msg = "checkoutCtrl";

    scope.price = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();
    scope.orderId = "123456";
    scope.amount = "84555.30";
    scope.currency = "RSD";

    scope.nameSurname = "";

    scope.note = "";

    scope.dateDropDownInput = "";

    scope.executePayment = function () {
        console.log("Payment Information!");
        console.log("Name " + scope.nameSurname);
        console.log("Delivery time: " + scope.dateDropDownInput);
        console.log("Note: " + scope.note);
    }
}]);
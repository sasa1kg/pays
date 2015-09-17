angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$http", "$filter", "CartService",  function (scope, http, filter,CartService) {

    console.log("checkoutCtrl");
    scope.msg = "checkoutCtrl";

    scope.price = CartService.getTotalCartAmount() + "";

    scope.orderId = "123456";
    scope.amount = "84555.30";
    scope.currency = "RSD";

}]);
angular.module('paysApp').controller("orderCtrl", ["$scope", "$rootScope", "$routeParams", "$location", "OrderService","CartService",
  function (scope, rootScope, routeParams, location, OrderService,CartService) {

    console.log("orderCtrl!");
    var orderId = routeParams.orderId;
    console.log("ORDER ID "+ orderId);

    CartService.resetCart();
    OrderService.clearOrderData();

    scope.goToMainPage = function(){
      location.window("#/");
    };
  }]);
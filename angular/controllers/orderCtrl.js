angular.module('paysApp').controller("orderCtrl", ["$scope", "$rootScope", "$routeParams", "$window", "OrderService", "CartService", "SearchService","UserService",
  function (scope, rootScope, routeParams, window, OrderService, CartService, SearchService,UserService) {

    console.log("orderCtrl!");
    var orderId = routeParams.orderId;
    console.log("ORDER ID " + orderId);

    CartService.resetCart();
    OrderService.clearOrderData();

    OrderService.getOrder(orderId).then(function (order) {
      scope.order     = order;
      var credentials = UserService.getUserCredentials();
      if (credentials.role == rootScope.buyerUserType && scope.order.orderedBy == credentials.id) {
        SearchService.getClientById(scope.order.orderedBy, 0).then(function clientDataArrived(client) {
          scope.order.client = client;
        });
        SearchService.getFarmerById(scope.order.orderedFrom, 0).then(function (farmer) {
          scope.order.farmer = farmer;
        });
        UserService.getUserPreviousDeliveryAddress(scope.order.orderedBy).then(function (address) {
          UserService.storeUserDeliveryAddresses(scope.order.orderedBy, address);
        });
      } else {
        scope.order = null;
      }
    });

    scope.goToMainPage = function () {
      window.location.href = "#/";
    };
  }]);
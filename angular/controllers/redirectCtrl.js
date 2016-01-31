angular.module('paysApp').controller("redirectCtrl", ["$scope", "$rootScope", "$routeParams", "$location", "UserService",
  function (scope, rootScope, routeParams, location, UserService) {

    console.log("redirectCtrl!");
    var token = routeParams.token;
    var idmId = routeParams.id;
    var role  = routeParams.role;

    UserService.getUserIdFromIDMId(idmId, role).then(function (id) {
      UserService.storeUserCredentials(token, id.id, role);
      if (role === rootScope.buyerUserType) {
        UserService.getUserPreviousDeliveryAddress(id.id).then(function (address) {
          UserService.storeUserDeliveryAddresses(id.id, address);
        });
      }
    });

    location.path('#/');

  }]);
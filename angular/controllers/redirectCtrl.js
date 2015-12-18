angular.module('paysApp').controller("redirectCtrl", ["$scope", "$http", "$filter","$routeParams","$location", "CartService", "WishlistService","UserService", "Notification",
    function (scope, http, filter, routeParams,location, CartService, WishlistService, UserService, Notification) {

        console.log("redirectCtrl!");
        var token = routeParams.token;
        var idmId = routeParams.id;
        var role = routeParams.role;

        UserService.getUserIdFromIDMId(idmId,role).then(function (id){
            UserService.storeUserCredentials(token,id.id,role);
        });

        location.path('#/');

    }]);
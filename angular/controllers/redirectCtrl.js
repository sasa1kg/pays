angular.module('paysApp').controller("redirectCtrl", ["$scope", "$http", "$filter","$routeParams","$location", "CartService", "WishlistService","UserService", "Notification",
    function (scope, http, filter, routeParams,location, CartService, WishlistService, UserService, Notification) {

        console.log("redirectCtrl!");
        var token = routeParams.token;
        var idmId = routeParams.id;
        var role = routeParams.role;


        location.path('#/');

        UserService.getUserIdFromIDMId(idmId,role).then(function (id){
            UserService.storeUserCredentials(token,id.id,role);
        });

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

    }]);
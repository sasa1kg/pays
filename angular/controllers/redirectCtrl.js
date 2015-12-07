angular.module('paysApp').controller("redirectCtrl", ["$scope", "$http", "$filter","$routeParams","$location", "CartService", "WishlistService","UserService", "Notification",
    function (scope, http, filter, routeParams,location, CartService, WishlistService, UserService, Notification) {

        console.log("redirectCtrl!");
        var token = routeParams.token;
        var id = routeParams.id;
        var role = routeParams.role;

        location.path('#/');

        UserService.storeUserCredentials(token,id,role);

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

    }]);
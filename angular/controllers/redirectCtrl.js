angular.module('paysApp').controller("redirectCtrl", ["$scope", "$http", "$filter","$routeParams","$location", "CartService", "WishlistService","UserService", "Notification",
    function (scope, http, filter, routeParams,location, CartService, WishlistService, UserService, Notification) {

        console.log("redirectCtrl!");
        var token = routeParams.token;
        var id = routeParams.id;
        var role = routeParams.role;
        console.log("token:  " + token);
        console.log("id:  " + id);
        console.log("role:  " + role);


        location.path('#/');

        UserService.storeUserData(token,id,role);

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

    }]);
angular.module('paysApp').controller("loginCtrl", ["$scope", "$http","$routeParams", "$filter", "CartService", "WishlistService",
    function (scope, http, routeParams, filter, CartService, WishlistService) {

        console.log("login Ctrl!");

        scope.userType = routeParams.usertype;

        console.log("Login user type "+ scope.userType);

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";

    }]);
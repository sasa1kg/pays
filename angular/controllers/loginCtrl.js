angular.module('paysApp').controller("loginCtrl", ["$scope", "$http", "$filter", "CartService", "WishlistService",
    function (scope, http, filter, CartService, WishlistService) {

        console.log("login Ctrl!");


        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";

    }]);
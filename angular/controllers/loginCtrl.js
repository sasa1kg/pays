angular.module('paysApp').controller("loginCtrl", ["$scope", "$http", "$filter", "CartService", "WishlistService","Notification",
    function (scope, http, filter, CartService, WishlistService,Notification) {

        console.log("login Ctrl!");

        scope.userType = "";

        console.log("Login user type "+ scope.userType);

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

        scope.wrongLogin = function(msg){
            Notification.error({message: msg});
        }
    }]);
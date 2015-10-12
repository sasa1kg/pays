angular.module('paysApp').controller("loginCtrl", ["$scope","$rootScope", "$http","$routeParams", "$filter", "CartService", "WishlistService","Notification",
    function (scope,rootScope, http, routeParams, filter, CartService, WishlistService,Notification) {

        console.log("login Ctrl!");

        scope.userType = routeParams.usertype;

        console.log("Login user type "+ scope.userType);

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";

        scope.wrongLogin = function(msg){
            Notification.error({message: 'Invalid credentials'});
        }
    }]);
/**
 * Created by nignjatov on 18.12.2015.
 */
angular.module('paysApp').controller("navbarCtrl", ["$scope","$rootScope","$location",
    "CartService", "WishlistService",
    function (scope, rootScope,location, CartService, WishlistService) {


        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

    }]);

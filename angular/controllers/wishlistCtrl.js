angular.module('paysApp').controller("wishlistCtrl", ["$scope", "$http", "$filter", "WishlistService", "CartService",  function (scope, http, filter, WishlistService, CartService) {

	console.log("wishlistCtrl!");

	
	scope.remove = function (productId, farmerId) {
		WishlistService.remove(productId, farmerId);
		scope.loadData();
	}

	scope.putToCart = function (productId, farmerId) {
		if (WishlistService.canBeAddedToCart(farmerId)) {
			WishlistService.toCart(productId, farmerId);
		} else {
			alert("Drugi farmer");
		}
		scope.loadData();
	}

	scope.more = function (productId, farmerId) {
		WishlistService.more(productId, farmerId);
		scope.loadData();
	}

	scope.less = function (productId, farmerId) {
		WishlistService.less(productId, farmerId);
		scope.loadData();
	}

	scope.loadData = function () {
		scope.cartItemsSize = CartService.getItemsSize();
		scope.wishlistItemsSize = WishlistService.getItemsSize();
		scope.wishlistItems = WishlistService.getItems();
	}
	

	scope.loadData();
}]);
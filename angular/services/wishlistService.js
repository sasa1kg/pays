var WishlistService = angular.module('WishlistService', []).service('WishlistService', ['localStorageService', function (localStorageService) {

	this.putInWishlist = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation) {
		var keys = localStorageService.keys();
		var added = false;
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.productId == productId && identifier.farmerId == farmerId && identifier.type == "wishlist") {
				var localItem = localStorageService.get(keys[i]);
				localItem.itemNum = localItem.itemNum + 1;
				localStorageService.set(keys[i], localItem);
				added = true;
				return;
			}
		};
		if (!added){
			localStorageService.set(JSON.stringify(
			{
					"type" : "wishlist",
					"productId" : productId,
					"farmerId" : farmerId,
			}
			), {
					"farmer" : farmerName,
					"farmerLocation" : farmerLocation,
					"farmerId" : farmerId,
					"itemName" : productName,
					"itemNum" : 1,
					"itemPrice" : productPrice,
					"itemMeasure" : productMeasure,
					"itemId" : productId,
					"image" : productImage
			});
		}
	}

	this.resetWishlist = function () {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist") {
				localStorageService.remove(keys[i]);
			}
		};
	}

	this.remove = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist" && identifier.productId == productId && identifier.farmerId == farmerId) {
				localStorageService.remove(keys[i]);
			}
		}
	}

	this.less = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist" && identifier.productId == productId && identifier.farmerId == farmerId) {
				var localItem = localStorageService.get(keys[i]);
				if (localItem.itemNum > 1) {
					localItem.itemNum = localItem.itemNum - 1;
					localStorageService.set(keys[i], localItem);
				} else {
					localStorageService.remove(keys[i]);
				}
			}
		}
	}

	this.more = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist" && identifier.productId == productId && identifier.farmerId == farmerId) {
				var localItem = localStorageService.get(keys[i]);
				localItem.itemNum = localItem.itemNum + 1;
				localStorageService.set(keys[i], localItem);
			}
		}

	}

	this.getItemsSize = function () {
		var itemsNum = 0;
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist") {
				itemsNum++;
			}
		};
		return itemsNum;
	}

	this.getItems = function () {
		var keys = localStorageService.keys();
		var items = [];
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist") {
				var localItem = localStorageService.get(keys[i]);
				items.push(localItem);
			}
		}
		return items;
	}

	this.canBeAddedToCart = function (farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart" && identifier.farmerId != farmerId) {
				return false;
			}
		};
		return true;
	}

	this.toCart = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "wishlist" && identifier.productId == productId && identifier.farmerId == farmerId) {
				var localItem = localStorageService.get(keys[i]);
				localStorageService.remove(keys[i]);
				identifier.type = "cart";
				localStorageService.set(JSON.stringify(identifier), localItem);
			}
		}
	}

}]);

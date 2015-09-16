var CartService = angular.module('CartService', []).service('CartService', ['localStorageService', function (localStorageService) {


	this.putInCart = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation) {
		var keys = localStorageService.keys();
		var added = false;
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.productId == productId && identifier.farmerId == farmerId && identifier.type == "cart") {
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
					"type" : "cart",
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
	};

	this.putInCartAmmount = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation, ammount) {
		var keys = localStorageService.keys();
		var added = false;
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.productId == productId && identifier.farmerId == farmerId && identifier.type == "cart") {
				var localItem = localStorageService.get(keys[i]);
				localItem.itemNum = ammount;
				localStorageService.set(keys[i], localItem);
				added = true;
				return;
			}
		};
		if (!added){
			localStorageService.set(JSON.stringify(
			{
					"type" : "cart",
					"productId" : productId,
					"farmerId" : farmerId,
			}
			), {
					"farmer" : farmerName,
					"farmerLocation" : farmerLocation,
					"farmerId" : farmerId,
					"itemName" : productName,
					"itemNum" : ammount,
					"itemPrice" : productPrice,
					"itemMeasure" : productMeasure,
					"itemId" : productId,
					"image" : productImage
			});
		}
	}

	this.more = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart" && identifier.productId == productId && identifier.farmerId == farmerId) {
				var localItem = localStorageService.get(keys[i]);
				localItem.itemNum = localItem.itemNum + 1;
				localStorageService.set(keys[i], localItem);
			}
		}

	}

	this.less = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart" && identifier.productId == productId && identifier.farmerId == farmerId) {
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

	this.updateProductAmount = function (productId, farmerId, amount) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart" && identifier.productId == productId && identifier.farmerId == farmerId) {
				var localItem = localStorageService.get(keys[i]);
				if (localItem.itemNum >= 1) {
					localItem.itemNum = amount;
					localStorageService.set(keys[i], localItem);
				} else {
					localStorageService.remove(keys[i]);
				}
			}
		}
	}

	this.resetCart = function () {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart") {
				localStorageService.remove(keys[i]);
			}
		};
	}

	this.remove = function (productId, farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart" && identifier.productId == productId && identifier.farmerId == farmerId) {
				localStorageService.remove(keys[i]);
			}
		}
	}

	this.canBeAdded = function (farmerId) {
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart" && identifier.farmerId != farmerId) {
				return false;
			}
		};
		return true;
	}

	this.getItemsSize = function () {
		var itemsNum = 0;
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart") {
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
			if (identifier.type == "cart") {
				var localItem = localStorageService.get(keys[i]);
				items.push(localItem);
			}
		}
		return items;
	}

	this.getTotalCartAmount = function() {
		var price = 0;
		var keys = localStorageService.keys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var identifier = JSON.parse(keys[i]);
			if (identifier.type == "cart") {
				var localItem = localStorageService.get(keys[i]);
				price += localItem.itemNum * localItem.itemPrice;
			}
		};
		return price;
	}

}]);
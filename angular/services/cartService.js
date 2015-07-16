var CartService = angular.module('CartService', []).service('CartService', ['localStorageService', function (localStorageService) {


	this.putInCart = function (key, value) {
		alert("Put in " + key + " " + value);
		localStorageService.set(key, value);
	};



	this.getItemsSize = function () {
		return localStorageService.length();
	}

	this.getItems = function () {
		var keys = localStorageService.keys();
		var items = [];
		for (var i = keys.length - 1; i >= 0; i--) {
			if (i == 2) {
				var item = {
					"farmer" : keys[i],
					"farmerLocation" : localStorageService.get(keys[i]),
					"farmerId" : 456,
					"itemName" : "Krastavac",
					"itemNum" : 3,
					"itemPrice" : 40,
					"itemMeasure" : "kg",
					"itemId" : 126,
					"itemPicture" : "images/cart/cucumber.png"
				};
			} else if (i==1) {
				var item = {
					"farmer" : keys[i],
					"farmerLocation" : localStorageService.get(keys[i]),
					"farmerId" : 456,
					"itemName" : "Paradajz",
					"itemNum" : 2,
					"itemPrice" : 100,
					"itemMeasure" : "kg",
					"itemId" : 124,
					"itemPicture" : "images/cart/tomato.png"
				};
			} else {
				var item = {
					"farmer" : keys[i],
					"farmerLocation" : localStorageService.get(keys[i]),
					"farmerId" : 456,
					"itemName" : "Mladi luk",
					"itemNum" : 2,
					"itemPrice" : 20,
					"itemMeasure" : "prut",
					"itemId" : 127,
					"itemPicture" : "images/cart/onion.gif"
				};
			}
			items.push(item);
		};
		return items;
	}

}]);
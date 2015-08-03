angular.module('paysApp').controller("searchCtrl", ["$scope", "$http", "$filter", "WishlistService", "CartService", "SearchService", 
	function (scope, http, filter, WishlistService, CartService, SearchService) {

	console.log("searchCtrl!");

	
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

	scope.locationName = "";
	scope.locationLink = "";
	scope.distance = "";
	scope.loadData = function () {
		scope.cartItemsSize = CartService.getItemsSize();
		scope.wishlistItemsSize = WishlistService.getItemsSize();
		scope.retrieveSearchData();

		SearchService.getSearchObject().then(function(data) {
			if (data.position.name === "YOUR_LOC") {
				scope.locationName = "VAŠE LOKACIJE";
				scope.distance = data.position.distance;
			} else {
				scope.locationName = data.positionName;
				scope.distance = data.position.distance;
			}
			scope.locationLink = "https://www.google.rs/maps/place/" + data.position.latitude + "," + data.position.longitude;
		});
	}

	scope.retrieveSearchData = function () {
		SearchService.getSearchResultsSize().then(function(data) {
    		scope.searchResultSize = data;
    		SearchService.getSearchResults(0, 10).then(function(data) {
    			var results = [];
    			for (var i = data.length - 1; i >= 0; i--) {
    				var priceSum = 0;
    				var chosenPriceSum = 0;
    				for (var j = data[i].searchProducts.length - 1; j >= 0; j--) {
    					priceSum = priceSum + (data[i].searchProducts[j].productAmmount * data[i].searchProducts[j].productPrice);
    					chosenPriceSum = priceSum;
    				};
    				var searchResult = {
    					"data" : data[i],
    					"isExtended" : false,
    					"chosenPriceSum" : chosenPriceSum,
    					"priceSum" : priceSum
    				};
    				results.push(searchResult);
    			};

    			scope.searchResults = results;
    
    		});
    	});
	}	
	
	scope.extend = function (farmerId) {
		console.log("Extend " + farmerId);
		for (var i = scope.searchResults.length - 1; i >= 0; i--) {
			if (scope.searchResults[i].data.farmerId == farmerId) {
				console.log("Found " + farmerId + " /// " + scope.searchResults[i].isExtended);
				scope.searchResults[i].isExtended = true;
			}
		};
	}; 

	scope.collapse = function (farmerId) {
		console.log("Collapse " + farmerId);
		for (var i = scope.searchResults.length - 1; i >= 0; i--) {
			if (scope.searchResults[i].data.farmerId == farmerId) {
				console.log("Found " + farmerId + " /// " + scope.searchResults[i].isExtended);
				scope.searchResults[i].isExtended = false;
			}
		};
	}; 

	scope.addAll = function (farmerId) {
		for (var i = scope.searchResults.length - 1; i >= 0; i--) {
			if (scope.searchResults[i].data.farmerId == farmerId) {
				for (var j = scope.searchResults[i].data.searchProducts.length - 1; j >= 0; j--) {
					scope.addToCart(farmerId, 
						scope.searchResults[i].data.farmer, 
						scope.searchResults[i].data.location, 
						scope.searchResults[i].data.searchProducts[j]);
				};
					
			}
		};
	}

	scope.addToCart = function(farmerId, farmerName, farmerLocation, product) {
		console.log("add to cart " + farmerId + " " + product.productName);
		if (CartService.canBeAdded(farmerId)) {
					CartService.putInCartAmmount(product.productId, 
						product.productName, 
						product.productMeasure, 
						product.productPrice, 
						product.productImage,
						farmerId, 
						farmerName, 
						farmerLocation,
						product.productAmmount);
		} else {
			alert("Proizvodi drugog farmera su u kolicima.");
		}
		scope.cartItemsSize = CartService.getItemsSize();
		scope.wishlistItemsSize = WishlistService.getItemsSize();
	}


	scope.recalculateTotal = function (farmerId) {
		for (var i = scope.searchResults.length - 1; i >= 0; i--) {
			if (scope.searchResults[i].data.farmerId == farmerId) {
				scope.searchResults[i].chosenPriceSum = 0;
				for (var j = scope.searchResults[i].data.searchProducts.length - 1; j >= 0; j--) {
					scope.searchResults[i].chosenPriceSum = scope.searchResults[i].chosenPriceSum 
					+ (scope.searchResults[i].data.searchProducts[j].productAmmount * scope.searchResults[i].data.searchProducts[j].productPrice);
				}
			}
		}
	}

	scope.moreItem = function (farmerId, productId) {
		for (var i = scope.searchResults.length - 1; i >= 0; i--) {
			if (scope.searchResults[i].data.farmerId == farmerId) {
				for (var j = scope.searchResults[i].data.searchProducts.length - 1; j >= 0; j--) {
					if (scope.searchResults[i].data.searchProducts[j].productId == productId) {
						scope.searchResults[i].data.searchProducts[j].productAmmount++;
						if (scope.searchResults[i].data.searchProducts[j].productAmmount > scope.searchResults[i].data.searchProducts[j].productStock) {
							scope.searchResults[i].data.searchProducts[j].productAmmount = scope.searchResults[i].data.searchProducts[j].productStock;
						}
						scope.recalculateTotal(farmerId);
					}
				}
			}
		}
	}

	scope.lessItem = function (farmerId, productId) {
		for (var i = scope.searchResults.length - 1; i >= 0; i--) {
			if (scope.searchResults[i].data.farmerId == farmerId) {
				for (var j = scope.searchResults[i].data.searchProducts.length - 1; j >= 0; j--) {
					if (scope.searchResults[i].data.searchProducts[j].productId == productId) {
						scope.searchResults[i].data.searchProducts[j].productAmmount--;
						if (scope.searchResults[i].data.searchProducts[j].productAmmount < 1) {
							scope.searchResults[i].data.searchProducts[j].productAmmount = 1;
						}
						scope.recalculateTotal(farmerId);
					}
				}
			}
		}
	}

	scope.loadData();
}]);
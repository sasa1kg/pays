var WishlistService = angular.module('WishlistService', []).service('WishlistService',
    ['localStorageService','CartService', function (localStorageService,CartService) {

    this.putInWishlist = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation, farmerEMail) {
        var keys = localStorageService.keys();
        var added = false;
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.farmerId == farmerId && identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                var localItem = localStorageService.get(keys[i]);
                localItem.items.push({
                    "itemName": productName,
                    "itemPrice": productPrice,
                    "itemMeasure": productMeasure,
                    "itemId": productId,
                    "image": productImage
                });
                localStorageService.set(keys[i], localItem);
                added = true;
                return;
            }
        }
        ;
        if (!added) {
            localStorageService.set(JSON.stringify(
                {
                    "type": "wishlist",
                    "farmerId": farmerId,
                    "farmer": farmerName,
                    "farmerLocation": farmerLocation,
                    "farmerEMail": farmerEMail
                }
            ), {
                items: [{
                    "itemName": productName,
                    "itemPrice": productPrice,
                    "itemMeasure": productMeasure,
                    "itemId": productId,
                    "image": productImage
                }]
            });
        }
    }

    this.removeFromWishList = function (productId, farmerId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.farmerId == farmerId && identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                for (var j = 0; j < localItem.items.length; j++) {
                    if (localItem.items[j].itemId == productId) {
                        localItem.items.splice(j, 1);
                        if (localItem.items.length == 0) {
                            localStorageService.remove(keys[i]);
                        } else {
                            localStorageService.set(keys[i], localItem);

                        }
                    }
                }
            }
        }
    }

    this.itemInWishlist = function (farmerId, productId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist" && identifier.farmerId == farmerId) {
                var localItem = localStorageService.get(keys[i]);
                for (var j = 0; j < localItem.items.length; j++) {
                    if (localItem.items[j].itemId == productId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    this.resetWishlist = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist") {
                localStorageService.remove(keys[i]);
            }
        }
        ;
    }

    this.getItemsSize = function () {
        var itemsNum = 0;
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                itemsNum += localItem.items.length;
            }
        }
        return itemsNum;
    }

    this.getItems = function () {
        var keys = localStorageService.keys();
        var items = [];
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                items.push({
                    farmer: identifier,
                    products: localItem
                });
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
        }
        ;
        return true;
    }

    this.toCart = function (productId, farmerId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist" && identifier.farmerId == farmerId) {
                var localItem = localStorageService.get(keys[i]);
                var addItem = null;
                for (var j = 0; j < localItem.items.length; j++) {
                    if (localItem.items[j].itemId == productId) {
                        addItem = localItem.items[j];
                        localItem.items.splice(j, 1);
                        if (localItem.items.length == 0) {
                            localStorageService.remove(keys[i]);
                        } else {
                            localStorageService.set(keys[i], localItem);

                        }
                    }
                }
                if(addItem != null) {
                    CartService.putInCartAmmount(productId, addItem.itemName, addItem.itemMeasure, addItem.itemPrice,
                        addItem.image, identifier.farmerId, identifier.farmer, identifier.farmerLocation,
                        identifier.farmerEMail, 1);
                }
            }
        }
    }
}]);

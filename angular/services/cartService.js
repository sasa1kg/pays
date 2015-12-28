var CartService = angular.module('CartService', []).service('CartService', ['localStorageService', function (localStorageService) {

        this.putInCartAmmount = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation, farmerEMail, ammount) {
            var keys = localStorageService.keys();
            var added = false;
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.farmerId == farmerId && identifier.type == "cart") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.items.push({
                        "itemName": productName,
                        "itemNum": ammount,
                        "itemPrice": productPrice,
                        "itemMeasure": productMeasure,
                        "itemId": productId,
                        "image": productImage
                    });
                    localStorageService.set(keys[i], localItem);
                    added = true;
                    return;
                }
            };
            if (!added) {
                localStorageService.set(JSON.stringify(
                    {
                        "type": "cart",
                        "farmerId": farmerId,
                        "farmer": farmerName,
                        "farmerLocation": farmerLocation,
                        "farmerEMail": farmerEMail
                    }
                ), {
                    items: [{
                        "itemName": productName,
                        "itemNum": ammount,
                        "itemPrice": productPrice,
                        "itemMeasure": productMeasure,
                        "itemId": productId,
                        "image": productImage
                    }],
                    "currency": "RSD"
                });
            }
        }

        this.more = function (productId, farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            localItem.items[j].itemNum = localItem.items[j].itemNum + 1;
                        }
                    }
                    localStorageService.set(keys[i], localItem);
                }
            }

        }

        this.less = function (productId, farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            if (localItem.items[j].itemNum > 1) {
                                localItem.items[j].itemNum = localItem.items[j].itemNum - 1;
                                localStorageService.set(keys[i], localItem);
                            } else {
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
        }

        this.updateProductAmount = function (productId, farmerId, amount) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            if (localItem.items[j].itemNum > 1) {
                                localItem.items[j].itemNum = amount;
                                localStorageService.set(keys[i], localItem);
                            } else {
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
        }

        this.resetCart = function () {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    localStorageService.remove(keys[i]);
                }
            }
        }

        this.remove = function (productId, farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
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

        this.canBeAdded = function (farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId != farmerId) {
                    return false;
                }
            }
            return true;
        }

        this.getItems = function () {
            var keys = localStorageService.keys();
            var items = null;
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    items = localStorageService.get(keys[i]);
                }
            }
            return items;
        }

        this.getTotalCartAmount = function () {
            var price = 0;
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        price += localItem.items[j].itemNum * localItem.items[j].itemPrice;
                    }
                }
            }
            return price;
        }

        this.getCartFarmer = function() {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    return identifier;
                }
            }
            return null;
        }
    }]);
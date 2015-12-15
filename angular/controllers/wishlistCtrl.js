angular.module('paysApp').controller("wishlistCtrl", ["$scope", "$http", "$filter", "WishlistService", "CartService", "Notification","SearchService",
    function (scope, http, filter, WishlistService, CartService, Notification,SearchService) {

        console.log("wishlistCtrl!");

        scope.farmerProducts = [];
        scope.price = CartService.getTotalCartAmount() + "";
        scope.remove = function (productId, farmerId) {
            WishlistService.remove(productId, farmerId);
            scope.loadData();
        }

        scope.putToCart = function (productId, farmerId, msg) {
            if (WishlistService.canBeAddedToCart(farmerId)) {
                WishlistService.toCart(productId, farmerId);
                Notification.info({message: msg});
            }
            scope.loadData();
        }

        scope.removeFromWishlist = function (productId, farmerId, msg) {
            WishlistService.removeFromWishList(productId, farmerId);
            scope.wishlistItems = WishlistService.getItemsSize();
            Notification.info({message: msg});
            scope.loadData();
        }

        scope.loadData = function () {
            scope.wishlistItemsSize = WishlistService.getItemsSize();
            scope.wishlistItems = WishlistService.getItems();
            for(var i=0;i<scope.wishlistItems.length;i++){
                SearchService.getProductImage(scope.wishlistItems[i].itemId,scope.wishlistItems[i].image).then(function (img) {
                    for (var j = 0; j < scope.wishlistItems.length; j++) {
                        if (scope.wishlistItems[j].itemId === img.index) {
                            scope.wishlistItems[j].img = "data:"+img.type+";base64,"+img.document_content;
                        }
                    }
                });
            }
            scope.farmerProducts = [];
            for (var i = 0; i < scope.wishlistItems.length; i++) {
                var item = scope.wishlistItems[i];
                item.itemNum = 1;
                var farmerFound = false;
                for (j = 0; j < scope.farmerProducts.length; j++) {
                    if (scope.farmerProducts[j].farmerId == item.farmerId) {
                        scope.farmerProducts[j].products.push(item);
                        farmerFound = true;
                        break;
                    }
                }
                if (farmerFound == false) {
                    scope.farmerProducts.push(
                        {
                            "farmerId": item.farmerId,
                            "farmerName": item.farmer,
                            "farmerLocation": item.farmerLocation,
                            "products": [item]
                        });
                }
            }

            for (var k = 0; k < scope.farmerProducts.length; k++) {
                console.log(scope.farmerProducts[k]);
            }
        }

        scope.canBeAdded = function (farmerId) {
            return CartService.canBeAdded(farmerId);
        }

        scope.isProductInCart = function (productId) {
            var items = CartService.getItems();
            for (var i = items.length - 1; i >= 0; i--) {
                if ((items[i].itemId == productId) && (items[i].itemNum > 0)) {
                    return true;
                }
            }
            return false;
        }

        scope.loadData();
    }]);
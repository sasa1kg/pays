angular.module('paysApp').controller("farmCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService",
    function (scope, http, filter, routeParams, CartService, WishlistService, SearchService) {


        console.log("FARM! " + routeParams.id);

        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();

        scope.farmerId = routeParams.id;
        scope.searchedItems = [];

        scope.amount = "";

        scope.addToWishlist = function (productId) {
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].id == productId) {
                    WishlistService.putInWishlist(scope.farmerProducts[i].id,
                        scope.farmerProducts[i].name,
                        scope.farmerProducts[i].measure,
                        scope.farmerProducts[i].price,
                        scope.farmerProducts[i].image,
                        scope.farmer.id,
                        scope.farmer.name,
                        scope.farmer.location
                    );
                }
            }
            scope.wishlistItems = WishlistService.getItemsSize();
        }


        scope.addToCart = function (productId) {

            if (CartService.canBeAdded(scope.farmer.id)) {
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].id == productId) {
                        CartService.putInCartAmmount(scope.farmerProducts[i].id,
                            scope.farmerProducts[i].name,
                            scope.farmerProducts[i].measure,
                            scope.farmerProducts[i].price,
                            scope.farmerProducts[i].image,
                            scope.farmer.id,
                            scope.farmer.name,
                            scope.farmer.location,
                            1);
                    }
                }
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].id == productId) {
                        scope.farmerProducts[i].itemNum = 1;
                    }
                }

                scope.cartItems = CartService.getItemsSize();
                scope.wishlistItems = WishlistService.getItemsSize();
            } else {
                alert("Proizvodi drugog farmera su u kolicima.");
            }
        }

        scope.isProductInCart = function (productId) {

            var items = CartService.getItems();
            for (var i = items.length - 1; i >= 0; i--) {
                if ((items[i].itemId == productId) &&(items[i].itemNum > 0)) {
                    return true;
                }
            }
            return false;
        }

        scope.addMore = function (productId) {
            CartService.more(productId,scope.farmerId);
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].id == productId) {
                    scope.farmerProducts[i].itemNum++;
                }
            }
        }

        scope.less = function (productId) {
            CartService.less(productId,scope.farmerId);
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].id == productId) {
                    scope.farmerProducts[i].itemNum--;
                }
            }
        }

        scope.setAmount = function (productId, amount) {

            if(!isNaN(amount) && (amount >= 0)) {
                console.log("Amount of " + productId + " = " + amount);
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].id == productId) {
                        scope.farmerProducts[i].itemNum = amount;
                    }
                }
                CartService.updateProductAmount(productId,scope.farmerId,amount);

            }
        }

        scope.farmer = SearchService.getFarmerById(scope.farmerId);
        scope.searchedItems = SearchService.getSearchedItems();
        scope.farmerProducts = SearchService.getProducts();
        var items = CartService.getItems();
        for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
            scope.farmerProducts[i].itemNum = 0;
            for (var j = items.length - 1; j >= 0; j--) {
                if (scope.farmerProducts[i].id == items[j].itemId) {
                    scope.farmerProducts[i].itemNum = items[j].itemNum;
                    break;
                }
            }
        }

        scope.price = CartService.getTotalCartAmount()+"";
    }]);
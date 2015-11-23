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
                if (scope.farmerProducts[i].product.id == productId) {
                    WishlistService.putInWishlist(scope.farmerProducts[i].product.id,
                        scope.farmerProducts[i].product.name,
                        scope.farmerProducts[i].measure,
                        scope.farmerProducts[i].price,
                        scope.farmerProducts[i].image,
                        scope.farmer.id,
                        scope.farmer.name,
                        scope.farmer.address
                    );
                }
            }
            scope.wishlistItemsSize = WishlistService.getItemsSize();
        }

        scope.removeFromWishlist = function (productId) {
            WishlistService.removeFromWishList(productId,scope.farmer.id);
            scope.wishlistItemsSize = WishlistService.getItemsSize();
        }

        scope.isProductInWishlist = function(productId){
            return WishlistService.itemInWishlist(scope.farmerId,productId);
        }

        scope.addToCart = function (productId) {
            if (CartService.canBeAdded(scope.farmer.id)) {
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].product.id == productId) {
                        CartService.putInCartAmmount(scope.farmerProducts[i].product.id,
                            scope.farmerProducts[i].product.name,
                            scope.farmerProducts[i].measure,
                            scope.farmerProducts[i].price,
                            scope.farmerProducts[i].image,
                            scope.farmer.id,
                            scope.farmer.name,
                            scope.farmer.address,
                            scope.farmer.email,
                            1);
                    }
                }
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].product.id == productId) {
                        scope.farmerProducts[i].itemNum = 1;
                    }
                }



                scope.cartItems = CartService.getItemsSize();
                scope.wishlistItems = WishlistService.getItemsSize();

                scope.price = CartService.getTotalCartAmount()+"";
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
                if (scope.farmerProducts[i].product.id == productId) {
                    scope.farmerProducts[i].itemNum++;
                }
            }
            scope.price = CartService.getTotalCartAmount()+"";
        }

        scope.less = function (productId) {
            CartService.less(productId,scope.farmerId);
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].product.id == productId) {
                    scope.farmerProducts[i].itemNum--;
                }
            }
            scope.price = CartService.getTotalCartAmount()+"";
        }

        scope.setAmount = function (productId, amount) {

            if(!isNaN(amount) && (amount >= 0)) {
                console.log("Amount of " + productId + " = " + amount);
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].product.id == productId) {
                        scope.farmerProducts[i].itemNum = parseFloat(amount);
                    }
                }
                CartService.updateProductAmount(productId,scope.farmerId,parseFloat(amount));
                scope.price = CartService.getTotalCartAmount()+"";
            }
        }

        SearchService.getFarmerById(scope.farmerId).then(function(data){
            if(data){
                scope.farmer = data;
                scope.farmer.img = "images/home/farm1.jpg";
            }else{
                console.log("Unable to load farmer from DB");
            }
        });

        SearchService.getFarmerProducts(scope.farmerId).then(function(data){
            if(data){
                scope.farmerProducts = data;
                var items = CartService.getItems();
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    scope.farmerProducts[i].itemNum = 0;
                    scope.farmerProducts[i].image = "images/home/fruit-vegetables.jpg";
                    for (var j = items.length - 1; j >= 0; j--) {
                        if (scope.farmerProducts[i].product.id == items[j].itemId) {
                            scope.farmerProducts[i].itemNum = items[j].itemNum;
                            break;
                        }
                    }
                }

                var searched = SearchService.getSearchedItems();
                for (var i = searched.length - 1; i >= 0; i--) {
                    for (var j = scope.farmerProducts.length - 1; j >= 0; j--) {
                        if (searched[i].id == scope.farmerProducts[j].product.id) {
                            scope.searchedItems.push(scope.farmerProducts[j])
                        }
                    }
                }
            }else{
                console.log("Unable to load farmer products from DB");
            }
        });

        scope.canBeAdded = function(){
            return CartService.canBeAdded(scope.farmerId);
        }

        scope.price = CartService.getTotalCartAmount()+"";
        scope.wishlistItemsSize = WishlistService.getItemsSize();
    }]);
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
                        scope.farmerProducts[i].product.images[0],
                        scope.farmer.id,
                        scope.farmer.businessSubject.name,
                        scope.farmer.businessSubject.city
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
                            scope.farmerProducts[i].product.images[0],
                            scope.farmer.id,
                            scope.farmer.businessSubject.name,
                            scope.farmer.businessSubject.city,
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
                SearchService.getFarmerImage(scope.farmer.id,0).then(function (img){
                    scope.farmer.img = img.document_content;
                });
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
                    SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images[0]).then(function (img) {
                        for (var j = 0; j < scope.farmerProducts.length; j++) {
                            if (scope.farmerProducts[j].product.id === img.index) {
                                scope.farmerProducts[j].product.img = "data:"+img.type+";base64,"+img.document_content;
                            }
                        }
                    });
                    for (var k = items.length - 1; k >= 0; k--) {
                        if (scope.farmerProducts[i].product.id == items[k].itemId) {
                            scope.farmerProducts[i].itemNum = items[k].itemNum;
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
    }]);
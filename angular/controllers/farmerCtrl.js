angular.module('paysApp').controller("farmCtrl", ["$scope", "$rootScope", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService","FarmerService",
    function (scope, rootScope, filter, routeParams, CartService, WishlistService, SearchService,FarmerService) {


        console.log("FARM! " + routeParams.id);
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();


        scope.farmerId = routeParams.id;
        scope.searchedItems = [];
        scope.prices = [];
        scope.amount = "";

        scope.addToWishlist = function (productId) {
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].product.id == productId) {
                    WishlistService.putInWishlist(scope.farmerProducts[i].product.id,
                        scope.farmerProducts[i].product.name,
                        scope.farmerProducts[i].measure,
                        scope.farmerProducts[i].price.price,
                        scope.farmerProducts[i].product.images,
                        scope.farmer.id,
                        scope.farmer.businessSubject.name,
                        scope.farmer.businessSubject.city,
                        scope.farmer.email
                    );
                }
            }
            scope.wishlistItemsSize = WishlistService.getItemsSize();
        }

        scope.removeFromWishlist = function (productId) {
            WishlistService.removeFromWishList(productId, scope.farmer.id);
            scope.wishlistItemsSize = WishlistService.getItemsSize();
        }

        scope.isProductInWishlist = function (productId) {
            return WishlistService.itemInWishlist(scope.farmerId, productId);
        }

        scope.addToCart = function (productId) {
            if (CartService.canBeAdded(scope.farmer.id)) {
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].product.id == productId) {
                        CartService.putInCartAmmount(scope.farmerProducts[i].product.id,
                            scope.farmerProducts[i].product.name,
                            scope.farmerProducts[i].measure,
                            scope.farmerProducts[i].price.price,
                            scope.farmerProducts[i].product.images,
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

                scope.wishlistItems = WishlistService.getItemsSize();

                scope.price = CartService.getTotalCartAmount() + "";
            } else {
                alert("Proizvodi drugog farmera su u kolicima.");
            }
        }

        scope.isProductInCart = function (productId) {

            var content = CartService.getItems(scope.farmerId);
            if (content != null) {
                for (var i = content.items.length - 1; i >= 0; i--) {
                    if ((content.items[i].itemId == productId) && (content.items[i].itemNum > 0)) {
                        return true;
                    }
                }
            }
            return false;
        }

        scope.addMore = function (productId) {
            CartService.more(productId, scope.farmerId);
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].product.id == productId) {
                    scope.farmerProducts[i].itemNum++;
                }
            }
            scope.price = CartService.getTotalCartAmount() + "";
        }

        scope.less = function (productId) {
            CartService.less(productId, scope.farmerId);
            for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                if (scope.farmerProducts[i].product.id == productId) {
                    scope.farmerProducts[i].itemNum--;
                }
            }
            scope.price = CartService.getTotalCartAmount() + "";
        }

        scope.setAmount = function (productId, amount) {

            if (!isNaN(amount) && (amount >= 0)) {
                console.log("Amount of " + productId + " = " + amount);
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    if (scope.farmerProducts[i].product.id == productId) {
                        scope.farmerProducts[i].itemNum = parseFloat(amount);
                    }
                }
                CartService.updateProductAmount(productId, scope.farmerId, parseFloat(amount));
                scope.price = CartService.getTotalCartAmount() + "";
            }
        }

        SearchService.getFarmerById(scope.farmerId).then(function (data) {
            if (data) {
                scope.farmer = data;
                scope.farmer.bannerImages = [];
                var bannerPicIndex             = 0;
                for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.farmer.images.banner.length)); i++) {
                    FarmerService.getFarmerImage(routeParams.id, scope.farmer.images.banner[scope.farmer.images.banner.length - (i+1)])
                      .then(function (img) {
                          scope.farmer.bannerImages[bannerPicIndex++] = "data:image/jpeg;base64," + img.document_content;
                      });
                }
            } else {
                console.log("Unable to load farmer from DB");
            }
        });

        SearchService.getFarmerProducts(scope.farmerId).then(function (data) {
            if (data) {
                scope.farmerProducts = data;
                var content = CartService.getItems(scope.farmerId);
                for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
                    scope.farmerProducts[i].itemNum = 0;
                    SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images).then(function (img) {
                        for (var j = 0; j < scope.farmerProducts.length; j++) {
                            if (scope.farmerProducts[j].product.id === img.index) {
                                scope.farmerProducts[j].product.img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                    if (content != null) {
                        for (var k = content.items.length - 1; k >= 0; k--) {
                            if (scope.farmerProducts[i].product.id == content.items[k].itemId) {
                                scope.farmerProducts[i].itemNum = content.items[k].itemNum;
                                break;
                            }
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
            } else {
                console.log("Unable to load farmer products from DB");
            }
        });

        FarmerService.getPrices(routeParams.id).then(function (data) {
            if (data.prices && data.prices.length > 0) {
                angular.forEach(data.prices, function (price) {
                    if (!scope.prices[price.distance]) {
                        scope.prices[price.distance]               = new Array();
                        scope.prices[price.distance][price.weight] = price.price;
                    } else {
                        scope.prices[price.distance][price.weight] = price.price;
                    }
                });
            } else {
                for (var i in rootScope.transportDistances) {
                    scope.prices[rootScope.transportDistances[i]] = [];
                    for (var j in rootScope.transportWeights) {
                        scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                    }
                }
            }
        }).catch(function(err){
            for (var i in rootScope.transportDistances) {
                scope.prices[rootScope.transportDistances[i]] = [];
                for (var j in rootScope.transportWeights) {
                    scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                }
            }
        });


        scope.canBeAdded = function () {
            return CartService.canBeAdded(scope.farmerId);
        }

        scope.reviews = [{
            commentBy : "Nemanja Ignjatov",
            created_at : "06-02-2006",
            rating : 4,
            comment : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa."
        },{
            commentBy : "Petar Ignjatov",
            created_at : "06-02-2006",
            rating : 3,
            comment : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa."
        },{
            commentBy : "Nemanja Ignjatov",
            created_at : "06-02-2005",
            rating : 5,
            comment : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa."
        },{
            commentBy : "Nemanja Ignjatov",
            created_at : "05-02-2006",
            rating : 1,
            comment : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa."
        },{
            commentBy : "Nemanja Ignjatov",
            created_at : "06-02-2006",
            rating : 2,
            comment : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa."
        }];

        scope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };
    }]);
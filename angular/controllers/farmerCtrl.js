angular.module('paysApp').controller("farmCtrl", ["$scope", "$rootScope", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService", "FarmerService",
  function (scope, rootScope, filter, routeParams, CartService, WishlistService, SearchService, FarmerService) {


    console.log("FARM! " + routeParams.id);
    scope.price             = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();


    scope.farmerId      = routeParams.id;
    scope.searchedItems = [];
    scope.prices        = [];
    scope.amount        = "";

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

    scope.addMore = function (product) {
      if (_validateProductAmount(product, ++product.itemNum)) {
        product.resourceExcedeed = false;
        product.alertMessage = "";
        CartService.more(product.product.id, scope.farmerId);
        scope.price              = CartService.getTotalCartAmount() + "";
      } else {
        product.itemNum--;
        product.resourceExcedeed = true;
        product.alertMessage = filter('translate')('MAX_AVAILABLE') + " "+product.amount +" "+product.measure.code;
      }
    }

    scope.less = function (product) {
      if (_validateProductAmount(product, --product.itemNum)) {
        product.resourceExcedeed = false;
        product.alertMessage = "";
        CartService.less(product.product.id, scope.farmerId);
        scope.price = CartService.getTotalCartAmount() + "";
      } else {
        product.itemNum++;
        product.resourceExcedeed = true;
        product.alertMessage = filter('translate')('MAX_AVAILABLE') + " "+product.amount +" "+product.measure.code;
      }
    }

    scope.setAmount = function (product, amount) {

      if ((amount != null) && (amount >= 0)) {
        console.log("Amount of " + product.product.id + " = " + amount + " MAX " + product.amount);
        if (!_validateProductAmount(product, amount)) {
          product.resourceExcedeed = true;
          product.alertMessage = filter('translate')('MAX_AVAILABLE') + " "+product.amount +" "+product.measure.code;
        } else {
          product.resourceExcedeed = false;
          product.alertMessage = "";
          CartService.updateProductAmount(product.product.id, scope.farmerId, parseFloat(amount));
          scope.price              = CartService.getTotalCartAmount() + "";
        }
      }
    }

    SearchService.getFarmerById(scope.farmerId).then(function (data) {
      if (data) {
        scope.farmer              = data;
        FarmerService.getReviews(scope.farmer.id).then(function (data) {
          scope.reviews = data;
        });
        scope.farmer.bannerImages = [];
        var bannerPicIndex        = 0;
        for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.farmer.images.banner.length)); i++) {
          FarmerService.getFarmerImage(routeParams.id, scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)])
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
        var content          = CartService.getItems(scope.farmerId);
        for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
          scope.farmerProducts[i].itemNum = 0;
          if (scope.farmerProducts[i].customImage) {
            FarmerService.getStockProductImage(scope.farmerProducts[i].stockItemId, scope.farmerProducts[i].customImage).then(function imgArrived(data) {
              for (var j = 0; j < scope.farmerProducts.length; j++) {
                if (scope.farmerProducts[j].stockItemId === data.index) {
                  scope.farmerProducts[j].product.img = "data:image/jpeg;base64," + data.document_content;
                }
              }
            });
          } else {
            SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images).then(function imgArrived(data) {
              for (var j = 0; j < scope.farmerProducts.length; j++) {
                if (scope.farmerProducts[j].product.id === data.index) {
                  scope.farmerProducts[j].product.img = "data:image/jpeg;base64," + data.document_content;
                }
              }
            });
          }
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
    }).catch(function (err) {
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

    scope.range = function (min, max, step) {
      step      = step || 1;
      var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
      return input;
    };

    _validateProductAmount = function (product, amount) {
      if (parseFloat(product.amount) >= amount) {
        return true;
      }
      return false;
    }
  }]);
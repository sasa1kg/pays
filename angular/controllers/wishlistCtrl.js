angular.module('paysApp').controller("wishlistCtrl", ["$scope", "$http", "$filter", "WishlistService", "CartService", "Notification", "SearchService","FarmerService",
  function (scope, http, filter, WishlistService, CartService, Notification, SearchService,FarmerService) {

    console.log("wishlistCtrl!");

    scope.farmerProducts = [];
    scope.price          = CartService.getTotalCartAmount() + "";

    scope.wishlistItemsSize = WishlistService.getItemsSize();
    scope.wishlistItems     = WishlistService.getItems();
    scope.images            = [];

    scope.farmers = [];

    scope.loadData = function () {
      scope.wishlistItemsSize = WishlistService.getItemsSize();
      scope.price             = CartService.getTotalCartAmount() + "";
      scope.wishlistItems     = WishlistService.getItems();
      for (var i = 0; i < scope.wishlistItems.length; i++) {
        for (var j = 0; j < scope.wishlistItems[i].products.items.length; j++) {
          for (var k = 0; k < scope.images.length; k++) {
            if (scope.wishlistItems[i].products.items[j].itemId == scope.images[k].itemId ||
              scope.wishlistItems[i].products.items[j].stockId == scope.images[k].itemId) {
              scope.wishlistItems[i].products.items[j].img = scope.images[k].img;
            }
          }
        }
      }
    }


    for (var i = 0; i < scope.wishlistItems.length; i++) {
      if (scope.farmers.indexOf(scope.wishlistItems[i].farmer) < 0) {
        scope.farmers.push(scope.wishlistItems[i].farmer);
      }
    }
    scope.loadData();
    for (var i = 0; i < scope.farmers.length; i++) {
      SearchService.getFarmerProducts(scope.farmers[i].farmerId).then(function (productData) {
        for (var i = 0; i < scope.wishlistItems.length; i++) {
          for (var j = 0; j < scope.wishlistItems[i].products.items.length; j++) {
            for (var p = 0; p < productData.length; p++) {
              if (scope.wishlistItems[i].products.items[j].itemId == productData[p].product.id) {
                if (productData[p].customImage) {
                  scope.wishlistItems[i].products.items[j].stockId = productData[p].stockItemId;
                  FarmerService.getStockProductImage(productData[p].stockItemId, productData[p].customImage).then(function imgArrived(img) {
                    for (var m = 0; m < scope.wishlistItems.length; m++) {
                      for (var n = 0; n < scope.wishlistItems[m].products.items.length; n++) {
                        if (scope.wishlistItems[m].products.items[n].stockId === img.index) {
                          scope.wishlistItems[m].products.items[n].img = "data:image/jpeg;base64," + img.document_content;
                          img.index = scope.wishlistItems[m].products.items[n].itemId;
                        }
                      }
                    }
                    scope.images.push({
                      itemId: img.index,
                      img: "data:image/jpeg;base64," + img.document_content
                    });
                  });
                } else {
                  SearchService.getProductImage(productData[p].product.id, productData[p].product.images).then(function imgArrived(img) {
                    for (var m = 0; m < scope.wishlistItems.length; m++) {
                      for (var n = 0; n < scope.wishlistItems[m].products.items.length; n++) {
                        if (scope.wishlistItems[m].products.items[n].itemId === img.index) {
                          scope.wishlistItems[m].products.items[n].img = "data:image/jpeg;base64," + img.document_content;
                        }
                      }
                    }
                    scope.images.push({
                      itemId: img.index,
                      img: "data:image/jpeg;base64," + img.document_content
                    });
                  });
                }
              }
            }
          }
        }
      });
    }
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

    scope.canBeAdded = function (farmerId) {
      return CartService.canBeAdded(farmerId);
    }

    scope.isProductInCart = function (productId) {
      var content = CartService.getItems();
      if (content != null) {
        for (var i = content.items.length - 1; i >= 0; i--) {
          if ((content.items[i].itemId == productId) && (content.items[i].itemNum > 0)) {
            return true;
          }
        }
      }
      return false;
    }

    scope.goToMainPage = function () {
      window.location.href = "#/";
    };

    scope.price             = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();
  }]);
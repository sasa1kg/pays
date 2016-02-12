angular.module('paysApp').controller("wishlistCtrl", ["$scope", "$http", "$filter", "WishlistService", "CartService", "Notification", "SearchService",
  function (scope, http, filter, WishlistService, CartService, Notification, SearchService) {

    console.log("wishlistCtrl!");

    scope.farmerProducts = [];
    scope.price          = CartService.getTotalCartAmount() + "";

    scope.wishlistItemsSize = WishlistService.getItemsSize();
    scope.wishlistItems     = WishlistService.getItems();
    scope.farmers           = [];
    for (var i = 0; i < scope.wishlistItems.length; i++) {
      if (scope.farmers.indexOf(scope.wishlistItems[i].farmer) < 0) {
        scope.farmers.push(scope.wishlistItems[i].farmer);
      }
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

    scope.loadData = function () {
      scope.wishlistItemsSize = WishlistService.getItemsSize();
      scope.price             = CartService.getTotalCartAmount() + "";
      scope.wishlistItems     = WishlistService.getItems();
      for (var i = 0; i < scope.wishlistItems.length; i++) {
        for (var j = 0; j < scope.wishlistItems[i].products.items.length; j++) {
          SearchService.getWishlistProductImage(scope.wishlistItems[i].products.items[j].itemId, scope.wishlistItems[i].products.items[j].image, i).then(function (img) {
            for (var k = 0; k < scope.wishlistItems[img.wishlistIndex].products.items.length; k++) {
              if (scope.wishlistItems[img.wishlistIndex].products.items[k].itemId === img.index) {
                scope.wishlistItems[img.wishlistIndex].products.items[k].img = "data:image/jpeg;base64," + img.document_content;
              }
            }
          });
        }
      }
    }

    scope.canBeAdded = function (farmerId) {
      return CartService.canBeAdded(farmerId);
    }

    scope.isProductInCart   = function (productId) {
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

    scope.loadData();
    scope.price             = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();
  }]);
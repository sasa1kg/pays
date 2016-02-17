angular.module('paysApp').controller("cartCtrl", ["$scope", "$rootScope", "$location", "$rootScope", "$modal", "$filter", "CartService", "WishlistService",
  "SearchService", "OrderService", "UserService", "FarmerService",
  function (scope, rootScope, location, rootScope, modal, filter, CartService, WishlistService, SearchService, OrderService, UserService, FarmerService) {

    console.log("Cart Ctrl!");

    scope.total = "";

    scope.shippingConst = 200;
    scope.shipping      = scope.shippingConst;
    scope.isShipped     = true;

    scope.previousAddresses = UserService.getUserDeliveryAddress(rootScope.credentials.id);

    scope.farmerData = CartService.getCartFarmer();
    if (scope.farmerData != null) {
      SearchService.getFarmerProducts(scope.farmerData.farmerId).then(function (data) {
        scope.farmerProducts = data;
        scope.cartItems      = CartService.getItems();
        scope.loadData();
        if (scope.cartItems != null) {
          for (var j = 0; j < scope.cartItems.items.length; j++) {
            for (var i = 0; i < scope.farmerProducts.length; i++) {
              if (scope.cartItems.items[j].itemId === scope.farmerProducts[i].product.id) {
                scope.cartItems.items[j].amount = scope.farmerProducts[i].amount;
                if (scope.farmerProducts[i].customImage) {
                  FarmerService.getStockProductImage(scope.farmerProducts[i].stockItemId, scope.farmerProducts[i].customImage).then(function imgArrived(data) {
                    for (var j = 0; j < scope.farmerProducts.length; j++) {
                      if (scope.farmerProducts[j].stockItemId === data.index) {
                        scope.farmerProducts[j].img = "data:image/jpeg;base64," + data.document_content;
                        data.index                  = scope.farmerProducts[j].product.id;
                      }
                    }
                    for (var j = 0; j < scope.cartItems.items.length; j++) {
                      if (scope.cartItems.items[j].itemId === data.index) {
                        scope.cartItems.items[j].img = "data:image/jpeg;base64," + data.document_content;
                      }
                    }
                  });
                } else {
                  SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images).then(function imgArrived(data) {
                    for (var j = 0; j < scope.farmerProducts.length; j++) {
                      if (scope.farmerProducts[j].product.id === data.index) {
                        scope.farmerProducts[j].img = "data:image/jpeg;base64," + data.document_content;
                      }
                    }
                    for (var j = 0; j < scope.cartItems.items.length; j++) {
                      if (scope.cartItems.items[j].itemId === data.index) {
                        scope.cartItems.items[j].img = "data:image/jpeg;base64," + data.document_content;
                      }
                    }
                  });
                }
              }
            }
          }
        }
      });
    }

    scope.calculateTotal = function () {
      scope.totalPrice = 0;
      for (var i = scope.cartItems.items.length - 1; i >= 0; i--) {
        scope.totalPrice = scope.totalPrice + scope.cartItems.items[i].itemPrice * scope.cartItems.items[i].itemNum;
      }
      scope.total = scope.totalPrice + scope.shipping;
    }


    scope.deleteCartItem = function (item) {
      CartService.remove(item.itemId, scope.farmerData.farmerId);
      scope.loadData();
      scope.price = CartService.getTotalCartAmount() + "";
      scope.calculateTotal();
    };

    scope.addMore   = function (item) {
      if (_validateProductAmount(item, ++item.itemNum)) {
        item.resourceExcedeed = false;
        item.alertMessage     = "";
        CartService.more(item.itemId, scope.farmerData.farmerId);
        scope.price           = CartService.getTotalCartAmount() + "";
        scope.calculateTotal();
      } else {
        item.itemNum--;
        item.resourceExcedeed = true;
        item.alertMessage     = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
      }
    }
    scope.less      = function (item) {
      if (_validateProductAmount(item, --item.itemNum)) {
        item.resourceExcedeed = false;
        item.alertMessage     = "";
        CartService.less(item.itemId, scope.farmerData.farmerId);
        scope.price           = CartService.getTotalCartAmount() + "";
        scope.calculateTotal();
        if (item.itemNum == 0) {
          scope.loadData();
        }
      } else {
        item.itemNum++;
        item.resourceExcedeed = true;
        item.alertMessage     = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
      }
    };
    scope.setAmount = function (item, amount) {

      if ((amount != null) && (amount >= 0)) {
        console.log("Amount of " + item.itemId + " = " + amount);
        if (!_validateProductAmount(item, amount)) {
          item.resourceExcedeed = true;
          item.alertMessage     = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
        } else {
          item.resourceExcedeed = false;
          item.alertMessage     = "";
          CartService.updateProductAmount(item.itemId, scope.farmerData.farmerId, parseFloat(amount));
          scope.price           = CartService.getTotalCartAmount() + "";
          scope.calculateTotal();
          if (amount == 0) {
            scope.loadData();
          }
        }
      }
    }

    scope.loadData = function () {
      scope.cartItems        = CartService.getItems();
      console.log("ITEMS " + scope.cartItems.length);
      if (scope.cartItems != null) {
        for (var j = 0; j < scope.cartItems.items.length; j++) {
          for (var i = 0; i < scope.farmerProducts.length; i++) {
            if (scope.cartItems.items[j].itemId === scope.farmerProducts[i].product.id) {
              scope.cartItems.items[j].amount = scope.farmerProducts[i].amount;
              scope.cartItems.items[j].img    = scope.farmerProducts[i].img;
              scope.cartItems.items[j].tax    = scope.farmerProducts[i].product.tax;
            }
          }
        }
      }
      scope.calculateTotal();
      scope.wishlistItemSize = WishlistService.getItemsSize();
    }

    scope.goBack = function () {
      window.history.back();
    }


    scope.openEmptyCartModal = function () {

      var modalInstance = modal.open({
        animation: true,
        templateUrl: 'emptyCartModal.html',
        controller: 'EmptyCartModalInstanceCtrl',
        size: 'sm'
      });
    };

    scope.price             = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();

    //Checkout data

    scope.predefinedLocationString = "predefinedLocation";
    scope.newAddressString         = "newAddress";

    scope.locationType = {
      selected: scope.predefinedLocationString,
    };

    scope.changeShipment = function (isShipped) {
      scope.isShipped = isShipped;

      if (scope.isShipped == true) {
        scope.shipping = scope.shippingConst;
      } else {
        scope.shipping = 0;
      }
      scope.calculateTotal();
    }

    SearchService.getCities().then(function (data) {
      scope.cities = data;
    });

    scope.goToPayment = function () {
      console.log(scope.locationType.selected);
      console.log(scope.address);
      OrderService.createOrderItem(scope.farmerData.farmerId, rootScope.credentials.id);
      OrderService.saveAddress(scope.isShipped, scope.address);
      OrderService.saveItems(scope.cartItems, scope.total);
      location.path("/checkout");
    }

    scope.address = {
      city: "",
      street: "",
      houseNumber: "",
      apartmentNumber: "",
      floor: "",
      postalCode: ""
    }

    scope.prevAddress = {
      address: null
    };

    scope.$watch('prevAddress.address', function () {
      if (scope.prevAddress.address != null) {
        var addressObj = JSON.parse(scope.prevAddress.address);
        scope.address  = {
          city: addressObj.city,
          street: addressObj.street,
          houseNumber: addressObj.houseNumber,
          apartmentNumber: parseInt(addressObj.apartmentNumber),
          floor: parseInt(addressObj.floor),
          postalCode: parseInt(addressObj.postalCode)
        }
      }
    });

    scope.$watch('address.city', function () {
      if ((scope.address.city != null) && (scope.address.city.length > 0)) {
        for (var i = 0; i < scope.cities.length; i++) {
          if (scope.cities[i].name == scope.address.city) {
            scope.address.postalCode = parseInt(scope.cities[i].postalCode);
            return true;
          }
        }
      }
    });

    _validateProductAmount = function (product, amount) {
      if (parseFloat(product.amount) >= amount) {
        return true;
      }
      return false;
    }
  }]);

angular.module('paysApp').controller('EmptyCartModalInstanceCtrl', function ($scope, $modalInstance, $location, CartService) {

  $scope.emptyCart = function () {
    console.log("Empty cart");
    CartService.resetCart();
    $modalInstance.close();
    $location.path('#/');
  }

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };
});
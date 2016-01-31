angular.module('paysApp').controller("cartCtrl", ["$scope", "$rootScope", "$location", "$rootScope", "$modal", "CartService", "WishlistService",
  "SearchService", "OrderService", "UserService",
  function (scope, rootScope, location, rootScope, modal, CartService, WishlistService, SearchService, OrderService, UserService) {

    console.log("Cart Ctrl!");

    scope.total = "";

    scope.shippingConst = 200;
    scope.shipping      = scope.shippingConst;
    scope.isShipped     = true;

    scope.previousAddresses = UserService.getUserDeliveryAddress(rootScope.credentials.id);

    scope.calculateTotal = function () {
      scope.totalPrice = 0;
      for (var i = scope.cartItems.items.length - 1; i >= 0; i--) {
        scope.totalPrice = scope.totalPrice + scope.cartItems.items[i].itemPrice * scope.cartItems.items[i].itemNum;
      }
      scope.total = scope.totalPrice + scope.shipping;
    }


    scope.deleteCartItem = function (itemId) {
      CartService.remove(itemId, scope.farmerData.farmerId);
      scope.loadData();
      scope.price = CartService.getTotalCartAmount() + "";
      scope.calculateTotal();
    };

    scope.addMore = function (itemId) {
      CartService.more(itemId, scope.farmerData.farmerId);
      scope.loadData();
      scope.price = CartService.getTotalCartAmount() + "";
      scope.calculateTotal();
    }
    scope.less    = function (itemId) {
      CartService.less(itemId, scope.farmerData.farmerId);
      scope.loadData();
      scope.price = CartService.getTotalCartAmount() + "";
      scope.calculateTotal();
    };


    scope.loadData = function () {
      scope.cartItems = CartService.getItems();
      if (scope.cartItems != null) {
        for (var i = 0; i < scope.cartItems.items.length; i++) {
          SearchService.getProductImage(scope.cartItems.items[i].itemId, scope.cartItems.items[i].image).then(function (img) {
            for (var j = 0; j < scope.cartItems.items.length; j++) {
              if (scope.cartItems.items[j].itemId === img.index) {
                scope.cartItems.items[j].img = "data:image/jpeg;base64," + img.document_content;
              }
            }
          });
        }
        scope.farmerData = CartService.getCartFarmer();
        scope.calculateTotal();
      }
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

    scope.setAmount         = function (productId, amount) {

      if (!isNaN(amount) && (amount >= 0)) {
        console.log("Amount of " + productId + " = " + amount);
        for (var i  = scope.cartItems.length - 1; i >= 0; i--) {
          if (scope.cartItems[i].id == productId) {
            scope.cartItems[i].itemNum = parseFloat(amount);
          }
        }
        CartService.updateProductAmount(productId, scope.farmerId, parseFloat(amount));
        scope.price = CartService.getTotalCartAmount() + "";
        scope.calculateTotal();
      }
    }

    scope.loadData();
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
        for(var i =0;i<scope.cities.length;i++){
          if(scope.cities[i].name == scope.address.city){
            scope.address.postalCode = parseInt(scope.cities[i].postalCode);
            return true;
          }
        }
      }
    });
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
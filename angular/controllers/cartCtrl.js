angular.module('paysApp').controller("cartCtrl", ["$scope", "$http", "$location", "$rootScope", "$modal", "CartService", "WishlistService",
    "SearchService", "OrderService",
    function (scope, http, location, rootScope, modal, CartService, WishlistService, SearchService, OrderService) {

        console.log("Cart Ctrl!");

        scope.total = "";

        scope.shippingConst = 200;
        scope.shipping = scope.shippingConst;
        scope.isShipped = true;

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
        scope.less = function (itemId) {
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

        scope.setAmount = function (productId, amount) {

            if (!isNaN(amount) && (amount >= 0)) {
                console.log("Amount of " + productId + " = " + amount);
                for (var i = scope.cartItems.length - 1; i >= 0; i--) {
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
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

        //Checkout data

        scope.predefinedLocationString = "predefinedLocation";
        scope.newAddressString = "newAddress";

        scope.locationType = {
            selected: scope.newAddressString,
        };

        scope.address = {
            newAddress: {
                city: "",
                street: "",
                houseNumber: "",
                apartmentNumber: "",
                floor: "",
                postalCode : ""
            },
            chosenAddress: ""
        }
        scope.changeShipment = function (isShipped) {
            scope.isShipped = isShipped;

            if (scope.isShipped == true) {
                scope.shipping = scope.shippingConst;
            } else {
                scope.shipping = 0;
            }
            scope.calculateTotal();
        }

        scope.cities = [
            {
                "id": 0,
                "name": "Novi Sad"
            },
            {
                "id": 1,
                "name": "Beograd"
            },
            {
                "id": 2,
                "name": "Kraljevo"
            }
        ]

        scope.addresses = [
            'Dositejeva 2',
            'Narodnog fronta 100',
            'Zmaj jovina 4',
            'Dunavska 63'
        ]

        scope.changed = function (adr) {
            scope.address.chosenAddress = adr;
        }

        scope.goToPayment = function () {
            console.log(scope.locationType.selected);
            console.log(scope.address);
            OrderService.createOrderItem(scope.farmerData.farmerId, rootScope.credentials.id);
            var address = "";
            if (scope.locationType.selected === scope.newAddressString) {
                address = scope.address.newAddress;
            } else {
                address = scope.address.chosenAddress;
            }
            OrderService.saveAddress(scope.isShipped, address);
            OrderService.saveItems(scope.cartItems, scope.total);
            location.path("/checkout");
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
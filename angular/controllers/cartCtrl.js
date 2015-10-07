angular.module('paysApp').controller("cartCtrl", ["$scope", "$http", "$location", "$filter", "$modal", "CartService", "WishlistService",
    function (scope, http, location, filter, modal, CartService, WishlistService) {

        console.log("Cart Ctrl!");

        scope.shippingConst = 200;
        scope.shipping = scope.shippingConst;
        scope.isShipped = true;

        scope.locationType = "";

        scope.predefinedLocationString = "predefinedLocation";
        scope.cityString = "city";

        scope.city = "";
        scope.street = "";
        scope.number = "";
        scope.appartment = "";
        scope.floor = "";
        scope.entrance = "";
        scope.chosenAddress = "";

        scope.calculateTotal = function () {
            scope.totalPrice = 0;
            for (var i = scope.cartItems.length - 1; i >= 0; i--) {
                scope.totalPrice = scope.totalPrice + scope.cartItems[i].itemPrice * scope.cartItems[i].itemNum;
            }
            scope.total = scope.totalPrice + scope.shipping;
        }


        scope.deleteCartItem = function (itemId) {
            CartService.remove(itemId, scope.farmerId);
            scope.loadData();
            scope.price = CartService.getTotalCartAmount()+"";
            scope.calculateTotal();
        };

        scope.addMore = function (itemId) {
            CartService.more(itemId, scope.farmerId);
            scope.loadData();
            scope.price = CartService.getTotalCartAmount()+"";
            scope.calculateTotal();
        }
        scope.less = function (itemId) {
            CartService.less(itemId, scope.farmerId);
            scope.loadData();
            scope.price = CartService.getTotalCartAmount()+"";
            scope.calculateTotal();
        };


        scope.loadData = function () {
            scope.cartItems = CartService.getItems();
            scope.cartItemsSize = CartService.getItemsSize();
            scope.wishlistItemSize = WishlistService.getItemsSize();
            if (scope.cartItems[0] != undefined) {
                scope.farmerName = scope.cartItems[0].farmer;
                scope.farmerLocation = scope.cartItems[0].farmerLocation;
                scope.farmerId = scope.cartItems[0].farmerId;
                scope.farmerEMail = scope.cartItems[0].farmerEMail;
            } else {
                scope.farmerName = "";
                scope.farmerLocation = "";
                scope.farmerId = "";
                scope.farmerEMail = "";
            }
            scope.calculateTotal();
        }

        scope.goBack = function() {
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

            if(!isNaN(amount) && (amount >= 0)) {
                console.log("Amount of " + productId + " = " + amount);
                for (var i = scope.cartItems.length - 1; i >= 0; i--) {
                    if (scope.cartItems[i].id == productId) {
                        scope.cartItems[i].itemNum = parseFloat(amount);
                    }
                }
                CartService.updateProductAmount(productId,scope.farmerId,parseFloat(amount));
                scope.price = CartService.getTotalCartAmount()+"";
                scope.calculateTotal();
            }
        }

        scope.changeShipment = function (isShipped){
            scope.isShipped = isShipped;

            if(scope.isShipped == true){
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

        scope.loadData();
        scope.price = CartService.getTotalCartAmount() + "";
    }]);

angular.module('paysApp').controller('EmptyCartModalInstanceCtrl', function ($scope, $modalInstance,$location,CartService) {

    $scope.emptyCart = function(){
        console.log("Empty cart");
        CartService.resetCart();
        $modalInstance.close();
        $location.path('#/');
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };
});
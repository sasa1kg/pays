angular.module('paysApp').controller("cartCtrl", ["$scope", "$http", "$location", "$filter", "$modal", "CartService", "WishlistService","SearchService",
    function (scope, http, location, filter, modal, CartService, WishlistService,SearchService) {

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
            for(var i=0;i<scope.cartItems.length;i++){
                SearchService.getProductImage(scope.cartItems[i].itemId,scope.cartItems[i].image).then(function (img) {
                    for (var j = 0; j < scope.cartItems.length; j++) {
                        if (scope.cartItems[j].itemId === img.index) {
                            scope.cartItems[j].img = "data:"+img.type+";base64,"+img.document_content;
                        }
                    }
                });
            }
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

        scope.changed = function (adr) {
            scope.chosenAddress = adr;
        }

        scope.loadData();
        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();
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
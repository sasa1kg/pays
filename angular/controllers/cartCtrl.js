angular.module('paysApp').controller("cartCtrl", ["$scope", "$rootScope", "$q", "$location", "$modal", "$filter", "CartService", "WishlistService",
    "SearchService", "OrderService", "UserService", "FarmerService", "Notification",
    function (scope, rootScope, q, location, modal, filter, CartService, WishlistService, SearchService, OrderService, UserService, FarmerService, Notification) {

        console.log("Cart Ctrl!");

        scope.total = "";

        scope.transportPrice = 0;

        scope.previousAddresses = UserService.getUserDeliveryAddress(rootScope.credentials.id);

        scope.farmerData = CartService.getCartFarmer();

        scope.farmer = null;

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

        scope.locationType = {};
        scope.predefinedLocation = {
            data: null
        };
        //Checkout data


        scope.transportPriceDeffered = null;

        scope.calculateTotal = function () {
            scope.totalPrice = 0;
            for (var i = scope.cartItems.items.length - 1; i >= 0; i--) {
                scope.totalPrice = scope.totalPrice + scope.cartItems.items[i].itemPrice * scope.cartItems.items[i].itemNum;
            }
            scope.total = scope.totalPrice + (scope.locationType.selected != rootScope.noDeliveryString ? parseFloat(scope.transportPrice) : 0);
        }

        scope.calculateTransportPrice = function () {
            scope.transportPriceDeffered = q.defer();
            if (scope.locationType.selected != rootScope.noDeliveryString) {
                SearchService.getDistanceBetweenCities(scope.address.city + ", Serbia", scope.farmerData.farmerLocation + ", Serbia").then(function (data) {
                    var reqData = {
                        distance: data,
                        items: []
                    };
                    angular.forEach(scope.cartItems.items, function (item) {
                        reqData.items.push({
                            item: item.itemId,
                            amount: item.itemNum
                        })
                    });
                    console.log(reqData);
                    FarmerService.getTransportPrice(scope.farmerData.farmerId, reqData).then(function (data) {
                        scope.transportPrice = data.price;
                        scope.calculateTotal();
                        Notification.success({message: filter('translate')('TRANSPORT_PRICE_SUCCESS')});
                        scope.transportPriceDeffered.resolve();

                    }).catch(function (err) {
                        Notification.error({message: filter('translate')('TRANSPORT_PRICE_FAILED')});
                        scope.transportPriceDeffered.reject();
                    })
                }).catch(function (err) {
                    Notification.error({message: filter('translate')('LOCATION_NOT_FOUND')});
                    scope.transportPriceDeffered.reject();
                });
            } else {
                scope.transportPrice = 0;
                scope.transportPriceDeffered.resolve();
            }
            return scope.transportPriceDeffered.promise;
        }

        SearchService.getPredefinedLocations().then(function (data) {
            scope.predefinedLocations = data;
        });
        scope.loadDeffered = null;
        if (scope.farmerData != null) {
            scope.loadDeffered = q.defer();
            SearchService.getFarmerById(scope.farmerData.farmerId).then(function (data) {
                scope.farmer = data;

                SearchService.getFarmerProducts(scope.farmerData.farmerId).then(function (data) {
                    scope.farmerProducts = data;
                    scope.cartItems = CartService.getItems();
                    scope.loadData();
                    var orderData = OrderService.getOrderData();
                    if (orderData != null) {
                        scope.locationType.selected = orderData.transportType;
                        scope.address = orderData.address;
                        scope.calculateTransportPrice();
                    } else {
                        scope.locationType.selected = rootScope.newAddressString;
                    }
                    scope.loadDeffered.resolve();
                    if (scope.cartItems != null) {
                        var promisesWaiting = 0;
                        scope.loadDeffered = q.defer();
                        for (var j = 0; j < scope.cartItems.items.length; j++) {
                            scope.cartItems.items[j].amount = 0;
                            for (var i = 0; i < scope.farmerProducts.length; i++) {
                                if (scope.cartItems.items[j].itemId === scope.farmerProducts[i].product.id) {
                                    scope.cartItems.items[j].amount = scope.farmerProducts[i].amount;
                                    if (scope.cartItems.items[j].amount < scope.cartItems.items[j].itemNum) {
                                        scope.cartItems.items[j].resourceExcedeed = true;
                                        scope.cartItems.items[j].alertMessage = filter('translate')('MAX_AVAILABLE') + " " + scope.cartItems.items[j].amount + " " + scope.cartItems.items[j].itemMeasure.code;
                                    }
                                    if(parseFloat(scope.cartItems.items[j].itemPrice) != parseFloat(scope.farmerProducts[i].price.price)){
                                        scope.cartItems.items[j].oldPrice = parseFloat(scope.cartItems.items[j].itemPrice).toFixed(2);
                                        scope.cartItems.items[j].itemPrice = parseFloat(scope.farmerProducts[i].price.price).toFixed(2);
                                    }
                                    scope.cartItems.items[j].shortDesc = scope.farmerProducts[i].product.shortDesc;
                                    if (scope.farmerProducts[i].customImage) {
                                        FarmerService.getStockProductImage(scope.farmerProducts[i].stockItemId, scope.farmerProducts[i].customImage).then(function imgArrived(data) {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                            for (var j = 0; j < scope.farmerProducts.length; j++) {
                                                if (scope.farmerProducts[j].stockItemId === data.index) {
                                                    scope.farmerProducts[j].img = "data:image/jpeg;base64," + data.document_content;
                                                    data.index = scope.farmerProducts[j].product.id;
                                                }
                                            }
                                            for (var j = 0; j < scope.cartItems.items.length; j++) {
                                                if (scope.cartItems.items[j].itemId === data.index) {
                                                    scope.cartItems.items[j].img = "data:image/jpeg;base64," + data.document_content;
                                                }
                                            }
                                        }).catch(function () {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                        });
                                        ;
                                        promisesWaiting++;
                                    } else {
                                        SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images).then(function imgArrived(data) {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
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
                                        }).catch(function () {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                        });
                                        promisesWaiting++;
                                    }
                                }
                            }
                            if (scope.cartItems.items[j].amount < scope.cartItems.items[j].itemNum) {
                                scope.cartItems.items[j].resourceExcedeed = true;
                                scope.cartItems.items[j].alertMessage = filter('translate')('MAX_AVAILABLE') + " " + scope.cartItems.items[j].amount + " " + scope.cartItems.items[j].itemMeasure.code;
                            }
                        }
                        if (promisesWaiting == 0) {
                            scope.loadDeffered.resolve();
                        }
                    }
                }).catch(function () {
                    scope.loadDeffered.resolve();
                });
            }).catch(function () {
                scope.loadDeffered.resolve();
            });
        }


        scope.deleteCartItem = function (item) {
            CartService.remove(item.itemId, scope.farmerData.farmerId);
            scope.loadData();
            scope.price = CartService.getTotalCartAmount() + "";
            scope.calculateTotal();
        };

        scope.addMore = function (item) {
            if (_validateProductAmount(item, ++item.itemNum)) {
                item.resourceExcedeed = false;
                item.alertMessage = "";
                CartService.more(item.itemId, scope.farmerData.farmerId);
                scope.price = CartService.getTotalCartAmount() + "";
                scope.calculateTotal();
            } else {
                item.itemNum--;
                item.resourceExcedeed = true;
                item.alertMessage = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
            }
        }
        scope.less = function (item) {
            if (_validateProductAmount(item, --item.itemNum)) {
                item.resourceExcedeed = false;
                item.alertMessage = "";
                CartService.less(item.itemId, scope.farmerData.farmerId);
                scope.price = CartService.getTotalCartAmount() + "";
                scope.calculateTotal();
                if (item.itemNum == 0) {
                    scope.loadData();
                }
            } else {
                item.resourceExcedeed = true;
                item.alertMessage = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
            }
        };
        scope.setAmount = function (item, amount) {

            if ((amount != null) && (amount >= 0)) {
                console.log("Amount of " + item.itemId + " = " + amount);
                if (!_validateProductAmount(item, amount)) {
                    item.resourceExcedeed = true;
                    item.alertMessage = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
                } else {
                    item.resourceExcedeed = false;
                    item.alertMessage = "";
                    CartService.updateProductAmount(item.itemId, scope.farmerData.farmerId, parseFloat(amount));
                    scope.price = CartService.getTotalCartAmount() + "";
                    scope.calculateTotal();
                    if (amount == 0) {
                        scope.loadData();
                    }
                }
            }
        }

        scope.loadData = function () {
            scope.cartItems = CartService.getItems();
            if (scope.cartItems != null) {
                for (var j = 0; j < scope.cartItems.items.length; j++) {
                    for (var i = 0; i < scope.farmerProducts.length; i++) {
                        if (scope.cartItems.items[j].itemId === scope.farmerProducts[i].product.id) {
                            scope.cartItems.items[j].amount = scope.farmerProducts[i].amount;
                            scope.cartItems.items[j].img = scope.farmerProducts[i].img;
                            scope.cartItems.items[j].tax = scope.farmerProducts[i].product.tax;
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


        scope.saveAddress = function () {
            var orderData = OrderService.getOrderData();
            if (orderData == null) {
                OrderService.createOrderItem(scope.farmerData.farmerId, rootScope.credentials.id);
            }
            OrderService.saveAddress(scope.locationType.selected, scope.address, scope.transportPrice,
                (scope.locationType.selected == rootScope.predefinedLocationString) ? JSON.parse(scope.predefinedLocation.data) : null);
        }
        scope.openEmptyCartModal = function () {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'emptyCartModal.html',
                controller: 'EmptyCartModalInstanceCtrl',
                size: 'sm'
            });
        };

        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();


        SearchService.getCities().then(function (data) {
            scope.cities = data;
        });

        scope.canGoToPayment = function () {
            if (scope.locationType.selected == rootScope.noDeliveryString) {
                return true;
            } else {
                if ((scope.address.city != null) && (scope.address.city.length > 0)
                    && (scope.address.postalCode != null) && (scope.address.postalCode > 0)
                    && (scope.address.street != null) && (scope.address.street.length > 0)
                    && (scope.address.houseNumber != null) && (scope.address.houseNumber.length > 0)) {
                    return true;
                }
            }
            return false;
        }
        scope.paymentDeffered = null;
        scope.goToPayment = function () {
            scope.paymentDeffered = q.defer();
            console.log(scope.locationType.selected);
            console.log(scope.address);
            scope.calculateTransportPrice().then(function () {
                OrderService.createOrderItem(scope.farmerData.farmerId, rootScope.credentials.id);
                OrderService.saveAddress(scope.locationType.selected, scope.address, scope.transportPrice,
                    (scope.locationType.selected == rootScope.predefinedLocationString) ? JSON.parse(scope.predefinedLocation.data) : null);
                OrderService.savePriceCalculatePrice(true);
                OrderService.saveItems(scope.cartItems, scope.total);
                OrderService.saveFarmerTime(scope.farmer.workHours);
                scope.paymentDeffered.resolve();
                location.path("/checkout");
            }).catch(function (err) {
                scope.paymentDeffered.reject();
            });
        }

        scope.$watch('prevAddress.address', function () {
            if (scope.prevAddress.address != null) {
                var addressObj = JSON.parse(scope.prevAddress.address);
                scope.address = {
                    city: addressObj.city,
                    street: addressObj.street,
                    houseNumber: addressObj.houseNumber,
                    apartmentNumber: parseInt(addressObj.apartmentNumber),
                    floor: parseInt(addressObj.floor),
                    postalCode: parseInt(addressObj.postalCode)
                }
            }
        });

        scope.$watch('predefinedLocation.data', function () {
            if (scope.predefinedLocation.data != null) {
                var addressObj = JSON.parse(scope.predefinedLocation.data).address;
                scope.address = {
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

        scope.$watch('locationType.selected', function () {
            if (scope.locationType.selected != null) {
                OrderService.savePriceCalculatePrice(false);
                if (scope.locationType.selected == rootScope.noDeliveryString) {
                    scope.transportPrice = 0;
                    scope.address = {};
                    scope.calculateTotal();
                }
                OrderService.saveAddress(scope.locationType.selected, scope.address, scope.transportPrice,
                    (scope.locationType.selected == rootScope.predefinedLocationString) ? JSON.parse(scope.predefinedLocation.data) : null);
            }
        });

        _validateProductAmount = function (product, amount) {
            if (parseFloat(product.amount) >= amount) {
                return true;
            }
            return false;
        }

        scope.goToFarmerPage = function (farmer) {
            console.log(farmer.farmerId);
            location.path("/farmer/" + farmer.farmerId);
        }

        //true ok, false to low
        scope.lowOrderAmount = function () {
            var retVal = false;
            if (scope.farmer != null) {
                if (parseFloat(scope.farmer.minOrderPrice) <= scope.totalPrice) {
                    retVal = true;
                }
            }
            return retVal;
        }
    }]);

angular.module('paysApp').controller('EmptyCartModalInstanceCtrl', function ($scope, $modalInstance, $location, CartService, OrderService) {

    $scope.emptyCart = function () {
        console.log("Empty cart");
        CartService.resetCart();
        OrderService.clearOrderData();
        $modalInstance.close();
        $location.path('#/');
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };
});
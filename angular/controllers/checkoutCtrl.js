angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$rootScope", "$filter", "$location", "CartService", "WishlistService",
    "OrderService", "UserService", "Notification",
    function (scope, rootScope, filter, location, CartService, WishlistService, OrderService, UserService, Notification) {

        scope.orderData = OrderService.getOrderData();
        if (scope.orderData != null) {
            scope.amount = scope.orderData.totalPrice;
            scope.currency = scope.orderData.currency;
            if (typeof scope.orderData.address === 'string') {
                scope.address = scope.orderData.address;
            } else {
                scope.addressJson = scope.orderData.address;
            }

            if (scope.orderData.clientId == null) {
                if (rootScope.credentials.id) {
                    scope.orderData.clientId = rootScope.credentials.id;
                    OrderService.saveClientId(scope.orderData.clientId);
                }
            }
            if (scope.orderData.clientId != null) {
                {
                    UserService.getUserData(scope.orderData.clientId).then(function (data) {
                        scope.userData = data;
                    }).catch(function (err) {
                        scope.userData = null;
                    });
                }
            }
            else {
                scope.userData = null;
            }
        }


        scope.fromTime = {
            time: ""
        };
        scope.toTime = {
            time: ""
        };
        scope.deliveryDate = {
            date: ""
        }

        scope.minDate = new Date();
        scope.dateFormat = 'yyyy-dd-MMMM';
        scope.timeFormat = 'HH:mm';


        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        scope.datePopup = {
            opened: false
        };

        scope.note = "";


        scope.executePayment = function () {
            console.log("Payment Information!");
            console.log(scope.date);
            var order = {
                farmerId: scope.orderData.farmerId,
                clientId: scope.orderData.clientId,
                transporterId: 15,
                currencyId: scope.orderData.currency.id,
                address: scope.addressJson,
                deliveryDate: filter('date')(scope.deliveryDate.date, scope.dateFormat),
                deliveryFrom: filter('date')(scope.fromTime.time, scope.timeFormat),
                deliveryTo: filter('date')(scope.toTime.time, scope.timeFormat),
                withTransport: scope.orderData.withTransport,
                totalPrice: scope.orderData.totalPrice,
                items: [],
                comment : scope.note
            };
            angular.forEach(scope.orderData.items.items, function (item) {
                console.log(item);
                order.items.push({
                    productId: item.itemId,
                    amount: item.itemNum,
                    measurementUnitId: item.itemMeasure.id,
                    totalPrice: item.itemPrice * item.itemNum
                });
            });
            console.log(order);
            OrderService.createOrder(order).then(function (data) {
                Notification.success({message: filter('translate')('ORDER_CREATED')});
                CartService.resetCart();
                OrderService.clearOrderData();
                location.path("/");
            }).catch(function (err) {
                Notification.error({message: filter('translate')('ORDER_NOT_CREATED')});
            });
        }

        scope.openDate = function () {
            scope.datePopup.opened = true;
        };

    }
])
;
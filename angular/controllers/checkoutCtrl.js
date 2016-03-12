angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$rootScope", "$filter", "$window", "$location", "$modal", "CartService", "WishlistService",
    "OrderService", "UserService", "Notification",
    function (scope, rootScope, filter, window, location, modal, CartService, WishlistService, OrderService, UserService, Notification) {

        scope.termsAccepted = false;
        scope.orderData = OrderService.getOrderData();
        if (scope.orderData != null) {
            scope.orderData.totalPrice = parseFloat(scope.orderData.totalPrice).toFixed(2);
            scope.orderData.transportPrice = scope.orderData.withTransport == true ? parseFloat(scope.orderData.transportPrice).toFixed(2) : parseFloat("0.00").toFixed(2);
            scope.orderData.totalProductPrice = (parseFloat(scope.orderData.totalPrice) - parseFloat(scope.orderData.transportPrice)).toFixed(2);
            angular.forEach(scope.orderData.items.items, function (item) {
                var taxLower = (100 * parseFloat(item.tax)) / (100 + parseFloat(item.tax)) / 100;
                item.totalTax = (parseFloat(item.itemNum) * parseFloat(item.itemPrice) * taxLower).toFixed(2);
                item.itemPriceNoTax = (parseFloat(item.itemPrice) - parseFloat(item.itemPrice) * taxLower).toFixed(2);
                console.log(item);
            });
            scope.amount = scope.orderData.totalPrice;
            scope.currency = scope.orderData.currency;
            scope.addressJson = scope.orderData.address;


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

        scope.dateFormat = 'yyyy-MM-dd';
        scope.timeFormat = 'HH:mm';

        scope.deliveryDate = {
            date: null
        }

        scope.dateOptions = {
            startingDay: 1
        };
        scope.minDate = new Date(new Date().getTime()+24*3600*1000);
        scope.maxDate = new Date(new Date().getTime()+15*24*3600*1000);

        scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        }

        var today = new Date().getTime();
        var date = null;
        var counter =1;
        while (scope.deliveryDate.date == null){
            date = new Date(new Date().getTime()+counter*24*3600*1000);
            if(date.getDay() !== 0 && date.getDay() !== 6){
                scope.deliveryDate.date = date;
            }
            counter++;
        }

        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        var startTimeDeliveryHours = 8;
        var endTimeDeliveryHours = 19;
        var minimalHoursDistance = 1;


        scope.fromTime = {
            minTime: null,
            maxTime : null,
            time: null
        };
        scope.toTime = {
            minTime: null,
            maxTime : null,
            time: null
        };

        scope.datePopup = {
            opened: false
        };

        scope.note = "";

        scope.$watch('fromTime.time', function () {
            var minToTime = scope.fromTime.time.getTime() +1*3600*1000;
            if (minToTime > scope.toTime.time.getTime()) {
                scope.toTime.time = new Date(minToTime);
                scope.toTime.minTime = new Date(minToTime);
            } else {
                scope.toTime.minTime = new Date(minToTime);
            }
        });

        scope.$watch('deliveryDate.date', function () {
            if(scope.fromTime.minTime == null){
                scope.fromTime.minTime = new Date(new Date().setHours(startTimeDeliveryHours,0,0,0));
                scope.fromTime.maxTime = new Date(new Date().setHours(endTimeDeliveryHours,0,0,0));
                scope.fromTime.time = new Date(new Date().setHours(startTimeDeliveryHours,0,0,0));
                scope.toTime.minTime = new Date(new Date().setHours(startTimeDeliveryHours+1,0,0,0));
                scope.toTime.time = new Date(new Date().setHours(startTimeDeliveryHours+1,0,0,0));
                scope.toTime.maxTime = new Date(new Date().setHours(endTimeDeliveryHours+1,0,0,0));
            }
        });


        scope.executePayment = function () {
            console.log("Payment Information!");
            console.log(scope.date);
            var order = {
                farmerId: scope.orderData.farmerId,
                clientId: scope.orderData.clientId,
                currencyId: scope.orderData.currency.id,
                deliveryDate: filter('date')(scope.deliveryDate.date, scope.dateFormat),
                deliveryFrom: filter('date')(scope.fromTime.time, scope.timeFormat),
                deliveryTo: filter('date')(scope.toTime.time, scope.timeFormat),
                transportPrice: scope.orderData.transportPrice,
                withTransport: scope.orderData.withTransport,
                totalPrice: scope.orderData.totalPrice,
                items: [],
                comment: scope.orderData.comment
            };
            if(scope.orderData.predefinedLocation == null){
                order.address = scope.addressJson;
            } else {
                order.deliveryPlace = scope.orderData.predefinedLocation.id;
            }
            angular.forEach(scope.orderData.items.items, function (item) {
                console.log(item);
                order.items.push({
                    productId: item.itemId,
                    amount: item.itemNum,
                    measurementUnitId: item.itemMeasure.id,
                    totalPrice: item.itemPrice,
                    tax: item.tax
                });
            });
            console.log(order);
            OrderService.createOrder(order).then(function (data) {
                Notification.success({message: filter('translate')('ORDER_CREATED')});
                window.location.href = data.redirectURL;
            }).catch(function (err) {
                Notification.error({message: filter('translate')('ORDER_NOT_CREATED')});
            });
        }

        scope.openDate = function () {
            scope.datePopup.opened = true;
        };
        scope.showPaysCompanyInfo = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'paysCompanyInfoModal.html',
                controller: 'PaymentRegulationsCtrl',
                size: 'lg'
            });
        }
        scope.showOfferedGoods = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'offeredGoodsModal.html',
                controller: 'PaymentRegulationsCtrl',
                size: 'lg'
            });
        }
        scope.showTermsOfService = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'termsOfServiceModal.html',
                controller: 'PaymentRegulationsCtrl',
                size: 'lg'
            });
        }
    }
]);

angular.module('paysApp').controller('PaymentRegulationsCtrl', function ($scope, $modalInstance) {

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };
});

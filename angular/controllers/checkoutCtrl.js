angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$rootScope", "$filter", "$window", "$location", "$modal", "CartService", "WishlistService",
    "OrderService", "UserService", "Notification",
    function (scope, rootScope, filter, window, location, modal, CartService, WishlistService, OrderService, UserService, Notification) {

        scope.noTransportPrice = false;

        scope.workDaysArray = [];
        scope.workDaysSize = 0;

        _convertWorkHoursObjToDaysArray = function (workHours) {

            scope.workDaysArray.push(_convertDayStringToObj(workHours.sun));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.mon));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.tue));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.wed));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.thu));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.fri));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.sat));

        }
        _convertDayStringToObj = function (day) {
            var retObj = null;
            if (day != null && day.length > 1) {
                var retObj = {};
                var timeString = day.split('-');
                var fromStrings = timeString[0].split(':');
                var toStrings = timeString[1].split(':');
                retObj.fromTime = new Date(new Date().setHours(parseInt(fromStrings[0]), parseInt(fromStrings[1]), 0, 0));
                retObj.toTime = new Date(new Date().setHours(parseInt(toStrings[0]), parseInt(toStrings[1]), 0, 0));
                scope.workDaysSize++;
            }
            return retObj;
        }

        scope.termsAccepted = false;
        scope.orderData = OrderService.getOrderData();
        if (scope.orderData != null) {
            if ((scope.orderData.transportType != rootScope.noDeliveryString) && (scope.orderData.transportCalculated == false)) {
                scope.noTransportPrice = true;
            } else {
                _convertWorkHoursObjToDaysArray(scope.orderData.workHours);
                scope.orderData.totalPrice = parseFloat(scope.orderData.totalPrice).toFixed(2);
                scope.orderData.transportPrice = scope.orderData.transportType != rootScope.noDeliveryString ? parseFloat(scope.orderData.transportPrice).toFixed(2) : parseFloat("0.00").toFixed(2);
                scope.orderData.totalProductPrice = (parseFloat(scope.orderData.totalPrice) - parseFloat(scope.orderData.transportPrice)).toFixed(2);
                scope.totalOrderTax = 0;
                angular.forEach(scope.orderData.items.items, function (item) {
                    var taxLower = (100 * parseFloat(item.tax)) / (100 + parseFloat(item.tax)) / 100;
                    item.totalTax = (parseFloat(item.itemNum) * parseFloat(item.itemPrice) * taxLower).toFixed(2);
                    scope.totalOrderTax += item.totalTax;
                    item.itemPriceNoTax = (parseFloat(item.itemPrice) - parseFloat(item.itemPrice) * taxLower).toFixed(2);
                });
                scope.amount = scope.orderData.totalPrice;
                scope.currency = scope.orderData.currency;
                scope.addressJson = scope.orderData.address;
                scope.totalOrderTax = parseFloat(scope.totalOrderTax).toFixed(2);

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
        }


        scope.dateFormat = 'yyyy-MM-dd';
        scope.timeFormat = 'HH:mm';

        scope.deliveryDate = {
            date: null
        }

        scope.dateOptions = {
            startingDay: 1
        };
        scope.minDate = new Date(new Date().getTime() + 24 * 3600 * 1000);
        scope.maxDate = new Date(new Date().getTime() + 15 * 24 * 3600 * 1000);

        scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( scope.workDaysArray[date.getDay()] == null));
        }

        var today = new Date().getTime();
        var date = null;
        var counter = 1;
        while (scope.deliveryDate.date == null && counter < 8) {
            date = new Date(new Date().getTime() + counter * 24 * 3600 * 1000);
            if (scope.workDaysArray[date.getDay()] != null) {
                scope.deliveryDate.date = date;
            }
            counter++;
        }

        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        var minimalHoursDistance = 1;


        scope.fromTime = {
            minTime: null,
            maxTime: null,
            time: null
        };
        scope.toTime = {
            minTime: null,
            maxTime: null,
            time: null
        };

        scope.datePopup = {
            opened: false
        };

        scope.note = "";

        scope.$watch('fromTime.time', function () {
            if (scope.fromTime != null && scope.fromTime.time != null) {
                var minToTime = scope.fromTime.time.getTime() + 1 * 3600 * 1000;
                if (minToTime > scope.toTime.time.getTime()) {
                    scope.toTime.time = new Date(minToTime);
                    scope.toTime.minTime = new Date(minToTime);
                } else {
                    scope.toTime.minTime = new Date(minToTime);
                }
            }
        });

        scope.$watch('deliveryDate.date', function () {
            if (scope.deliveryDate.date) {
                var obj = scope.workDaysArray[scope.deliveryDate.date.getDay()];
                console.log(obj);
                scope.fromTime.minTime = new Date(obj.fromTime.getTime());
                scope.fromTime.maxTime = new Date(obj.toTime.getTime() - 3600 * 1000);
                scope.toTime.minTime = new Date(obj.fromTime.getTime() + 3600 * 1000);
                scope.toTime.maxTime = new Date(obj.toTime.getTime());
                //delayed update because of timepicker data race condition
                setTimeout(function () {
                    scope.toTime.time = obj.toTime;
                    scope.fromTime.time = obj.fromTime;
                }, 10);

            }
        });


        scope.executePayment = function () {
            console.log("Payment Information!");
            console.log(scope.date);
            var order = {
                farmerId: scope.orderData.farmerId,
                clientId: scope.orderData.clientId,
                currencyId: scope.orderData.currency.id,
                transportPrice: scope.orderData.transportPrice,
                withTransport: scope.orderData.transportType != rootScope.noDeliveryString,
                totalPrice: scope.orderData.totalPrice,
                items: [],
                comment: scope.orderData.comment
            };
            if (scope.orderData.transportType == rootScope.previousLocationString || scope.orderData.transportType == rootScope.newAddressString) {
                order.address = scope.addressJson;
            } else if (scope.orderData.transportType == rootScope.predefinedLocationString) {
                order.deliveryPlace = scope.orderData.predefinedLocation.id;
            }

            if (scope.orderData.transportType != rootScope.noDeliveryString) {
                order.deliveryDate = filter('date')(scope.deliveryDate.date, scope.dateFormat);
                order.deliveryFrom = filter('date')(scope.fromTime.time, scope.timeFormat);
                order.deliveryTo = filter('date')(scope.toTime.time, scope.timeFormat);
            }
            angular.forEach(scope.orderData.items.items, function (item) {
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
                if(err.error.message.indexOf("Item price changed") >= 0){
                    Notification.error({message: filter('translate')('ITEM_PRICE_CHANGED')});
                } else {
                    Notification.error({message: filter('translate')('ORDER_NOT_CREATED')});
                }
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

angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$rootScope", "$filter","$window", "$location","$modal", "CartService", "WishlistService",
    "OrderService", "UserService", "Notification",
    function (scope, rootScope, filter, window,location,modal, CartService, WishlistService, OrderService, UserService, Notification) {

        scope.termsAccepted = false;
        scope.orderData = OrderService.getOrderData();
        if (scope.orderData != null) {
            scope.orderData.totalPrice = parseFloat(scope.orderData.totalPrice).toFixed(2);
            scope.orderData.transportPrice = parseFloat(scope.orderData.transportPrice).toFixed(2);
            scope.orderData.totalProductPrice = (parseFloat(scope.orderData.totalPrice) - parseFloat(scope.orderData.transportPrice)).toFixed(2);
            angular.forEach(scope.orderData.items.items , function(item){
                var taxLower = (100 * parseFloat(item.tax))/(100+parseFloat(item.tax))/100;
                item.totalTax = (parseFloat(item.itemNum) * parseFloat(item.itemPrice) * taxLower).toFixed(2);
                item.itemPriceNoTax =  (parseFloat(item.itemPrice) -  parseFloat(item.itemPrice) * taxLower).toFixed(2);
               console.log(item);
            });
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


        scope.fromTime ={
            minTime : null,
            time: new Date()
        };
        scope.toTime = {
            minTime : null,
            time: new Date()
        };


        scope.deliveryDate = {
            date: new Date()
        }

        scope.minDate = new Date();
        scope.dateFormat = 'yyyy-MM-dd';
        scope.timeFormat = 'HH:mm';


        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        scope.datePopup = {
            opened: false
        };

        scope.note = "";

        scope.$watch('fromTime.time', function () {
            if(scope.fromTime.time > scope.toTime.time){
                scope.toTime.time = scope.fromTime.time;
                scope.toTime.minTime = scope.fromTime.time;
            } else {
                scope.toTime.minTime = scope.fromTime.time;
            }
        });

        scope.$watch('deliveryDate.date', function () {

            var todayMillis = new Date(new Date().toLocaleDateString("en-au", {year: "numeric", month: "short",day: "numeric"})).getTime();
            var deliveryMillis = new Date(scope.deliveryDate.date).getTime();
            if((deliveryMillis - todayMillis) > 1000*60*60*24){
                //if selected day is not today, enable all time periods for selection
                scope.fromTime.minTime = null;
                scope.fromTime.time = new Date();
            } else {
                // if selected day is today, enable just incoming time period
                scope.fromTime.minTime = new Date();
                scope.fromTime.time = new Date();
            }
        });


        scope.executePayment = function () {
            console.log("Payment Information!");
            console.log(scope.date);
            var order = {
                farmerId: scope.orderData.farmerId,
                clientId: scope.orderData.clientId,
                currencyId: scope.orderData.currency.id,
                address: scope.addressJson,
                deliveryDate: filter('date')(scope.deliveryDate.date, scope.dateFormat),
                deliveryFrom: filter('date')(scope.fromTime.time, scope.timeFormat),
                deliveryTo: filter('date')(scope.toTime.time, scope.timeFormat),
                transportPrice : scope.orderData.transportPrice,
                withTransport: scope.orderData.withTransport,
                totalPrice: scope.orderData.totalPrice,
                items: [],
                comment : scope.orderData.comment
            };
            angular.forEach(scope.orderData.items.items, function (item) {
                console.log(item);
                order.items.push({
                    productId: item.itemId,
                    amount: item.itemNum,
                    measurementUnitId: item.itemMeasure.id,
                    totalPrice: item.itemPrice,
                    tax : item.tax
                });
            });
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

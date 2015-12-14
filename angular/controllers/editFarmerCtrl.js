/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editFarmerCtrl", ["$scope", "$rootScope","$http", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService", "Notification",
    function (scope, rootScope, http, filter, modal, routeParams, CartService, WishlistService, SearchService, Notification) {

        console.log("edit farmer:  " + routeParams.id);

        scope.page = 'GENERAL_FARMER_DATA';
        scope.products = [];
        scope.orders = [];
        SearchService.getFarmerById(routeParams.id).then(function (data) {
            scope.farmer = data;
        });
        //scope.farmer = {
        //    "id": 1,
        //    "idmId": "farmer10",
        //    "type": "a",
        //    "advertisingText": "nekiTekst",
        //    "advertisingTitle": "neki naslov",
        //    "email": "petar.bjeljac@gmail.com",
        //    "orders": {},
        //    "businessSubject": {
        //        "name": "Firma1",
        //        "account": "840-1710666-12",
        //        "taxNum": "54435143",
        //        "companyNum": "454",
        //        "businessActivityCode": "123",
        //        "phone": "23423",
        //        "fax": "234",
        //        "city": null,
        //        "postalCode": null,
        //        "address": null
        //    }};

        SearchService.getFarmerProducts(routeParams.id).then(function (data) {
            scope.products = data;
            for(var i = 0; i < scope.products.length; i++){//TODO Add img id
                SearchService.getProductImage(scope.products[i].id, 0).then(function imgArrived(data){
                    for(var j = 0; j < scope.products.length; j++) {
                        if(scope.products[j].id === data.index) {
                            scope.products[j].img = data.document_content;
                        }
                    }
                });
            }
        });

        SearchService.getFarmerOrders(routeParams.id).then(function (data) {
            scope.orders = data;
            for(var i = 0; i < scope.orders.length; i++){
                SearchService.getClientById(scope.orders[i].orderedBy, 0).then(function clientDataArrived(client){

                    for(var j = 0; j < scope.orders.length; j++) {
                        console.log(scope.orders[j].orderedBy + ", " + client.id);
                        if(scope.orders[j].orderedBy == client.id) {
                            scope.orders[j].client = client;
                        }
                    }
                });
            }
        });

        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

        scope.prices = [];
//dummy load
        for (var i in rootScope.transportDistances){
            scope.prices[rootScope.transportDistances[i]] = [];
            for(var j in rootScope.transportWeights){
                scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = rootScope.transportDistances[i] * rootScope.transportWeights[j];
            }
        }
        scope.sectionChange = function (sectionName) {
            scope.page = sectionName;
        }
        scope.saveChanges = function () {
            console.log("Saving changes!");
        }

        scope.deleteProduct = function (product) {
            var idx = scope.products.indexOf(product);
            if (idx >= 0) {
                scope.products.splice(idx, 1);
            }
        }

        scope.updateProduct = function (product) {
            scope.openProductModal(product)
        }

        scope.addProduct = function () {
            scope.openProductModal()
        }

        scope. updatePrices = function(){
            console.log(scope.prices);
        }
        scope.openProductModal = function (product) {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'productEditModal.html',
                controller: 'ProductModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    products: function () {
                        return scope.products;
                    },
                    product: function () {
                        return product;
                    }
                }
            });

            modalInstance.result.then(function (productNew) {
                if (typeof productNew !== 'undefined') {
                    for (var v in scope.products) {
                        if (scope.products[v].product.id == productNew.product.id) {
                            scope.products[v] = productNew;
                        }
                    }
                }
            });
        };

        scope.openOrderModal = function (order) {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'orderEditModal.html',
                controller: 'OrderModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    orders: function () {
                        return scope.orders;
                    },
                    order: function () {
                        return order;
                    }
                }
            });
        };
    }]);

angular.module('paysApp').controller('ProductModalInstanceCtrl', function ($scope, $filter, $modalInstance, products, product) {

    var newProduct = false
    $scope.productNew = $.extend({}, product);
    if (typeof product === 'undefined') {
        newProduct = true;
    }

    $scope.saveChanges = function () {
        console.log($scope.productNew);
        if (newProduct == true) {
            products.push($scope.productNew);
            $modalInstance.close();
        }
            $modalInstance.close($scope.productNew);
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

});

angular.module('paysApp').controller('OrderModalInstanceCtrl', function ($scope, $filter, $modalInstance, orders, order) {

    $scope.orders = orders;
    $scope.order = order;
    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

});
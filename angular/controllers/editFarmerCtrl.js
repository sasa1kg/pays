/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editFarmerCtrl", ["$scope", "$rootScope","$http", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService", "FarmerService", "Notification",
    function (scope, rootScope, http, filter, modal, routeParams, CartService, WishlistService, SearchService, FarmerService, Notification) {

        console.log("edit Distributor:  " + routeParams.id);

        scope.page = 'GENERAL_FARMER_DATA';
        scope.products = [];
        scope.orders = [];
        SearchService.getFarmerById(routeParams.id).then(function (data) {
            scope.farmer = data;
        });

        SearchService.getFarmerProducts(routeParams.id).then(function (data) {
            scope.products = data;
            for(var i = 0; i < scope.products.length; i++){
                SearchService.getProductImage(scope.products[i].product.id, scope.products[i].product.images).then(function imgArrived(data){
                    for (var j = 0; j < scope.products.length; j++) {
                        if (scope.products[j].product.id === data.index) {
                            scope.products[j].product.img = "data:image/jpeg;base64,"+data.document_content;
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

        scope.saveGeneralInfoChanges = function () {
            console.log("Saving general info changes!");
            FarmerService.updateGeneralInfo(scope.farmer.id,
                {
                    businessSubject: scope.farmer.businessSubject
                }
            ).then(function (data) {
                    console.log(data);
                    Notification.success({message: filter('translate')('GENERAL_INFO_UPDATED')});
                }).catch(function (err) {
                    console.error(err);
                    Notification.error({message: filter('translate')('GENERAL_INFO_NOT_UPDATED')});
                })
            console.log("update end");
        }

        //scope.deleteProduct = function (product) {
        //    var idx = scope.products.indexOf(product);
        //    if (idx >= 0) {
        //        scope.products.splice(idx, 1);
        //    }
        //}

        scope.updateProduct = function (product) {
            scope.openProductModal(product)
        }

        scope.addProduct = function () {
            scope.openProductModal()
        }

        scope.updatePrices = function(){
            console.log(scope.prices);
        }

        scope.uploadProductPicture = function (productId, imageId, flow) {
            if (typeof flow.files !== 'undefined') {
                FarmerService.uploadProductImage(productId, imageId, flow).then(function (data) {
                    Notification.success({message: filter('translate')('PRODUCT_IMAGE_UPLOADED')});
                    scope.reloadProductImage(productId);
                }).catch(function (err) {
                    Notification.error({message: filter('translate')('PRODUCT_IMAGE_FAILURE')});
                    scope.reloadProductImage(productId);
                });
            }
            else{
                scope.reloadProductImage(productId);
            }
        }

        scope.reloadProductImage = function (productId) {
            FarmerService.getProductImages(productId).then(function (data) {
                if (data.length > 0) {
                    FarmerService.getProductImage(productId, data[data.length - 1])
                        .then(function (img) {
                            for (var i = 0; i < scope.products.length; i++) {
                                if (scope.products[i].id === img.index) {
                                    scope.products[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                }
            });
        }

        scope.deleteProduct = function (product) {
            FarmerService.deleteProduct(scope.farmer.id, product.stockItemId).then(function (data) {
                Notification.success({message: filter('translate')('PRODUCT_DELETED')});
                var idx = scope.products.indexOf(product);
                if (idx >= 0) {
                    scope.products.splice(idx, 1);
                }
            }).catch(function (data) {
                Notification.error({message: filter('translate')('PRODUCT_NOT_DELETED')});
            });

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

            modalInstance.result.then(function (returnJson) {
                if (typeof returnJson !== 'undefined') {
                    var found      = false;
                    var newImage   = returnJson.image.flow;
                    var productNew = returnJson.info;

                    angular.forEach(scope.products, function (product) {
                        if (product.product.id == productNew.product.id) {
                            found = true;
                            FarmerService.updateProduct(routeParams.id, productNew).then(function () {
                                Notification.success({message: filter('translate')('PRODUCT_UPDATED')});
                                scope.uploadProductPicture(productNew.id, productNew.images ? productNew.images : rootScope.undefinedImageId, newImage);
                                product = productNew;

                            }).catch(function () {
                                Notification.error({message: filter('translate')('PRODUCT_NOT_UPDATED')});
                            });
                        }
                    });
                    if (found == false) {
                        FarmerService.addNewProduct(routeParams.id, productNew).then(function () {
                            Notification.success({message: filter('translate')('PRODUCT_ADDED')});
                            SearchService.getFarmerProducts(routeParams.id).then(function (data) {
                                angular.forEach(data, function (newProd) {
                                    var exists = false;
                                    for (var j = 0; j < scope.products.length; j++) {
                                        if (scope.products[j].product.id === newProd.product.id) {
                                            exists = true;
                                        }
                                    }
                                    if (exists == false) {
                                        scope.products.push(newProd);
                                        scope.uploadProductPicture(newProd.product.id, rootScope.undefinedImageId, newImage);
                                    }
                                });

                            });
                        }).catch(function () {
                            Notification.error({message: filter('translate')('PRODUCT_NOT_ADDED')});
                        });
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
                    },
                    SearchService: function () {
                        return SearchService;
                    }
                }
            });
        };
    }]);

angular.module('paysApp').controller('ProductModalInstanceCtrl', function ($scope, $rootScope, $filter, $modalInstance, products, product, SearchService) {
    $scope.productImage = {
        flow: null
    }
    $scope.newProduct = false
    $scope.productNew = $.extend({}, product);
    if (typeof product === 'undefined') {
        $scope.newProduct = true;
        $scope.productNew.price ={};
        $scope.productNew.product ={};
        $scope.productNew.price.currency = $rootScope.defaultCurrency;

    }

    $scope.onProductNameChanged = function(){
        SearchService.getProductImage($scope.productNew.product.id, $scope.productNew.product.images).then(function imgArrived(data){
            if ($scope.productNew.product.id === data.index) {
                $scope.productNew.product.img = "data:image/jpeg;base64,"+data.document_content;
            }
        });
    }

    $scope.saveChanges = function () {
        console.log($scope.productNew);
        var returnJson = {
            info: $scope.productNew,
            image: $scope.productImage
        };
        if ($scope.newProduct == true) {
            $modalInstance.close(returnJson);
        }
        $modalInstance.close(returnJson);
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

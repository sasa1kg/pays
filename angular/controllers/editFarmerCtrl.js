/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editFarmerCtrl", ["$scope", "$rootScope","$http", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService", "FarmerService", "Notification",
    function (scope, rootScope, http, filter, modal, routeParams, CartService, WishlistService, SearchService, FarmerService, Notification) {

        console.log("edit Distributor:  " + routeParams.id);

        scope.page = 'GENERAL_FARMER_DATA';
        scope.products = [];
        scope.orders = [];
        scope.prices = [];
        scope.profilePic = {
            flow: null
        };


        SearchService.getFarmerById(routeParams.id).then(function (data) {
            scope.farmer = data;
            scope.farmer.bannerImages = [];

            //Initialize array for banner images
            for (var i = 0; i < rootScope.bannerPicsLimit; i++) {
                scope.farmer.bannerImages[i] = {
                    flow: null,
                    imageId: rootScope.undefinedImageId,
                    imgData: ""
                };
            }
            ;

            if (scope.farmer.images.profile != null) {
                FarmerService.getFarmerImage( scope.farmer.id, scope.farmer.images.profile)
                  .then(function (img) {
                      scope.farmer.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
                  });
            }
            var bannerPicIndex  = 0;
            var bannerLoadIndex = 0;
            for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.farmer.images.banner.length)); i++) {
                scope.farmer.bannerImages[bannerLoadIndex++].imageId = scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)];
                FarmerService.getFarmerImage(scope.farmer.id, scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)])
                  .then(function (img) {
                      if (img.type != 'undefined') {
                          console.log("RECEIVED BANNER IMG "+ img.imageIndex);
                          for (var j = 0; j < scope.farmer.bannerImages.length; j++) {
                              if (scope.farmer.bannerImages[j].imageId == img.imageIndex) {
                                  console.log("BANNER IMG MATCHED "+ img.imageIndex);
                                  scope.farmer.bannerImages[bannerPicIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                                  bannerPicIndex++
                              }
                          }
                      }
                  }
                )
                ;
            }
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


        scope.uploadProfilePicture = function () {
            if (typeof scope.profilePic.flow.files !== 'undefined') {
                FarmerService.uploadFarmerProfileImage(scope.farmer.id,
                  scope.farmer.images.profile ? scope.farmer.images.profile : rootScope.undefinedImageId,
                  scope.profilePic.flow).then(function (data) {
                      Notification.success({message: filter('translate')('PROFILE_IMAGE_UPLOADED')});
                      scope.profilePic.flow.cancel();
                      FarmerService.getFarmerImage(scope.farmer.id, data.image)
                        .then(function (img) {
                            scope.farmer.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
                        });
                  }).catch(function (err) {
                      Notification.error({message: filter('translate')('PROFILE_IMAGE_FAILURE')});
                      scope.profilePic.flow.cancel();
                  });

            }
        }

        scope.uploadFarmerBannerImage = function (bannerPictureIndex) {
            if (typeof scope.farmer.bannerImages[bannerPictureIndex].flow.files !== 'undefined') {
                FarmerService.uploadFarmerBannerImage(scope.farmer.id,
                  scope.farmer.bannerImages[bannerPictureIndex].imageId, scope.farmer.bannerImages[bannerPictureIndex].flow).
                  then(function (data) {
                      Notification.success({message: filter('translate')('BANNER_IMAGE_UPLOADED')});
                      scope.farmer.bannerImages[bannerPictureIndex].flow.cancel();
                      FarmerService.getFarmerImage(scope.farmer.id, data.image)
                        .then(function (img) {
                            scope.farmer.bannerImages[bannerPictureIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                            scope.farmer.bannerImages[bannerPictureIndex].imageId = img.imageIndex;
                        });
                  }).catch(function (err) {
                      Notification.error({message: filter('translate')('BANNER_IMAGE_FAILURE')});
                      scope.farmer.bannerImages[bannerPictureIndex].flow.cancel();
                  });

            }
        }

        FarmerService.getPrices(routeParams.id).then(function (data) {
            if (data.prices && data.prices.length > 0) {
                angular.forEach(data.prices, function (price) {
                    if (!scope.prices[price.distance]) {
                        scope.prices[price.distance]               = new Array();
                        scope.prices[price.distance][price.weight] = price.price;
                    } else {
                        scope.prices[price.distance][price.weight] = price.price;
                    }
                });
            } else {
                for (var i in rootScope.transportDistances) {
                    scope.prices[rootScope.transportDistances[i]] = [];
                    for (var j in rootScope.transportWeights) {
                        scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                    }
                }
            }
        }).catch(function(err){
            for (var i in rootScope.transportDistances) {
                scope.prices[rootScope.transportDistances[i]] = [];
                for (var j in rootScope.transportWeights) {
                    scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                }
            }
        });


        scope.updatePrices         = function () {
            var pricesObj = {
                currency: rootScope.defaultCurrency.id,
                prices: []
            };

            for (var i in rootScope.transportDistances) {
                for (var j in rootScope.transportWeights) {
                    pricesObj.prices.push({
                        weight: rootScope.transportWeights[j],
                        distance: rootScope.transportDistances[i],
                        price: scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]]
                    });
                }
            }

            FarmerService.updatePrices(scope.farmer.id, pricesObj).then(function (data) {
                Notification.success({message: filter('translate')('PRICES_UPDATED')});
            }).catch(function () {
                Notification.error({message: filter('translate')('PRICES_NOT_UPDATED')});
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

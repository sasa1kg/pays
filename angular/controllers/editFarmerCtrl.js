/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editFarmerCtrl", ["$scope", "$rootScope", "$q", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService", "FarmerService", "Notification",
    function (scope, rootScope, q, filter, modal, routeParams, CartService, WishlistService, SearchService, FarmerService, Notification) {

        console.log("edit Farmer:  " + routeParams.id);

        scope.page = 'GENERAL_FARMER_DATA';
        scope.products = [];
        scope.orders = [];
        scope.prices = [];
        scope.profilePic = {
            flow: null
        };

        scope.sortTypeProduct = "product.name.localization[currentLang]";
        scope.sortReverseProduct = false;

        scope.sortTypeOrder = "id";
        scope.sortReverseOrder = true;

        scope.loadGeneralDeffered = null;
        scope.loadVehicleDeffered = null;
        scope.loadAdvertisingDeffered = null;
        scope.loadPricesDeffered = null;
        scope.loadOrdersDeffered = null;

        scope.saveInfo = null;
        scope.uploadImage = null;
        scope.loadImage = null;
        scope.uploadAdvertisingImage = null;
        scope.loadAdvertisingImage = null;

        scope.workHours = [];
        scope.timeFormat = 'HH:mm';
        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        scope.loadGeneralDeffered = q.defer();

        SearchService.getFarmerById(routeParams.id).then(function (data) {
            scope.farmer = data;
            scope.farmer.minOrderPrice = scope.farmer.minOrderPrice != null ? scope.farmer.minOrderPrice : 0;
            scope.farmer.bannerImages = [];
            _convertWorkHoursStringToObj(scope.farmer.workHours);
            scope.loadGeneralDeffered.resolve();
            //Initialize array for banner images
            for (var i = 0; i < rootScope.bannerPicsLimit; i++) {
                scope.farmer.bannerImages[i] = {
                    flow: null,
                    imageId: rootScope.undefinedImageId,
                    imgData: ""
                };
            }
            ;
            if ((scope.farmer.images.profile != null) || (scope.farmer.images.banner.length)) {
                scope.loadAdvertisingDeffered = q.defer();
                var advertisingPromises = 0;
                if (scope.farmer.images.profile != null) {
                    FarmerService.getFarmerImage(scope.farmer.id, scope.farmer.images.profile)
                        .then(function (img) {
                            advertisingPromises--;
                            if (advertisingPromises == 0) {
                                scope.loadAdvertisingDeffered.resolve();
                            }
                            scope.farmer.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
                        }).catch(function () {
                        advertisingPromises--;
                        if (advertisingPromises == 0) {
                            scope.loadAdvertisingDeffered.resolve();
                        }
                    });
                    advertisingPromises++;
                }
                var bannerPicIndex = 0;
                var bannerLoadIndex = 0;
                for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.farmer.images.banner.length)); i++) {
                    scope.farmer.bannerImages[bannerLoadIndex++].imageId = scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)];
                    FarmerService.getFarmerImage(scope.farmer.id, scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)])
                        .then(function (img) {
                            advertisingPromises--;
                            if (advertisingPromises == 0) {
                                scope.loadAdvertisingDeffered.resolve();
                            }
                            if (img.type != 'undefined') {
                                for (var j = 0; j < scope.farmer.bannerImages.length; j++) {
                                    if (scope.farmer.bannerImages[j].imageId == img.imageIndex) {
                                        scope.farmer.bannerImages[bannerPicIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                                        bannerPicIndex++
                                    }
                                }
                            }
                        }).catch(function () {
                        advertisingPromises--;
                        if (advertisingPromises == 0) {
                            scope.loadAdvertisingDeffered.resolve();
                        }
                    });
                    advertisingPromises++;
                }
            }
        });
        scope.loadProductsDeffered = q.defer();
        SearchService.getFarmerProducts(routeParams.id).then(function (data) {
            scope.products = data;
            if (scope.products.length == 0) {
                scope.loadProductsDeffered.resolve();
            } else {
                var productPromises = 0;
                for (var i = 0; i < scope.products.length; i++) {
                    scope.products[i].amount = parseFloat(scope.products[i].amount).toFixed(2);
                    if (scope.products[i].customImage) {
                        FarmerService.getStockProductImage(scope.products[i].stockItemId, scope.products[i].customImage).then(function imgArrived(data) {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                            for (var j = 0; j < scope.products.length; j++) {
                                if (scope.products[j].stockItemId === data.index) {
                                    scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
                                }
                            }
                        }).catch(function () {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                        });
                        productPromises++;
                    } else {
                        SearchService.getProductImage(scope.products[i].product.id, scope.products[i].product.images).then(function imgArrived(data) {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                            for (var j = 0; j < scope.products.length; j++) {
                                if (scope.products[j].product.id === data.index) {
                                    scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
                                }
                            }
                        }).catch(function () {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                        });
                        productPromises++;
                    }
                }
            }
        }).catch(function () {
            scope.loadProductsDeffered.reject();
        });

        scope.loadOrdersDeffered = q.defer();
        SearchService.getFarmerOrders(routeParams.id).then(function (data) {
            scope.orders = [];
            var clientIds = [];
            angular.forEach(data, function (order) {
                if (order.status != 'C') {
                    order.totalPrice = parseFloat(order.totalPrice).toFixed(2);
                    order.numericStatus = rootScope.getNumericOrderStatus(order.status);
                    order.acceptedPrice = parseFloat(0);
                    if (order.status == 'D' || order.status == 'P') {
                        order.acceptedPrice = parseFloat(0);
                        angular.forEach(order.items, function (item) {
                            item.totalPayPrice = (parseFloat(item.totalItemPrice) * parseFloat(item.amount)).toFixed(2);
                            if (item.status == "A") {
                                order.acceptedPrice += parseFloat(item.totalItemPrice) * parseFloat(item.amount);
                            }
                        });

                        if(order.acceptedPrice > 0){
                            order.acceptedPrice = order.acceptedPrice + parseFloat(order.transportPrice);
                        }
                        order.acceptedPrice = order.acceptedPrice.toFixed(2);
                    }
                    scope.orders.push(order);
                    if (clientIds.indexOf(order.orderedBy) == -1) {
                        clientIds.push(order.orderedBy);
                    }
                }
            });
            if (clientIds.length == 0) {
                scope.loadOrdersDeffered.resolve();
            } else {
                var clientPromises = 0;
                for (var i = 0; i < clientIds.length; i++) {
                    SearchService.getClientById(clientIds[i], 0).then(function clientDataArrived(client) {
                        clientPromises--;
                        if (clientPromises == 0) {
                            scope.loadOrdersDeffered.resolve();
                        }
                        for (var j = 0; j < scope.orders.length; j++) {
                            if (scope.orders[j].orderedBy == client.id) {
                                scope.orders[j].client = client;
                            }
                        }
                    }).catch(function () {
                        clientPromises--;
                        if (clientPromises == 0) {
                            scope.loadOrdersDeffered.resolve();
                        }
                    });
                    clientPromises++;
                }
            }
        }).catch(function () {
            scope.loadOrdersDeffered.reject();
        });
        scope.loadPricesDeffered = q.defer();
        for (var i in rootScope.transportDistances) {
            scope.prices[rootScope.transportDistances[i]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for (var j in rootScope.transportWeights) {
                scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
            }
        }
        FarmerService.getPrices(routeParams.id).then(function (data) {
            if (data.prices && data.prices.length > 0) {
                angular.forEach(data.prices, function (price) {
                    if (!scope.prices[price.distance]) {
                        scope.prices[price.distance] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                        scope.prices[price.distance][price.weight] = parseFloat(price.price);
                    } else {
                        scope.prices[price.distance][price.weight] = parseFloat(price.price);
                    }
                });
            } else {
                for (var i in rootScope.transportDistances) {
                    scope.prices[rootScope.transportDistances[i]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j in rootScope.transportWeights) {
                        scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                    }
                }
            }
            scope.loadPricesDeffered.resolve();
        }).catch(function (err) {
            for (var i in rootScope.transportDistances) {
                scope.prices[rootScope.transportDistances[i]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                for (var j in rootScope.transportWeights) {
                    scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                }
            }
            scope.loadPricesDeffered.reject();
        });


        scope.sectionChange = function (sectionName) {
            scope.page = sectionName;
        }

        scope.saveGeneralInfoChanges = function () {
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
        }

        scope.updateProduct = function (product) {
            scope.openProductModal(product)
        }

        scope.addProduct = function () {
            scope.openProductModal()
        }

        scope.uploadStockProductImage = function (product, stockId, imageId, flow) {
            if ((typeof flow.files !== 'undefined') && (flow.files.length > 0)) {
                scope.uploadImage = q.defer();
                FarmerService.uploadStockProductImage(stockId, imageId, flow).then(function (data) {
                    scope.uploadImage.resolve();
                    Notification.success({message: filter('translate')('PRODUCT_IMAGE_UPLOADED')});
                    scope.reloadStockProductImage(stockId, data.image);
                    //Update product customImage ID
                    angular.forEach(scope.products, function (prod) {
                        if (product.id == prod.product.id) {
                            prod.customImage = data.image;
                        }
                    });
                }).catch(function (err) {
                    scope.uploadImage.reject();
                    Notification.error({message: filter('translate')('PRODUCT_IMAGE_FAILURE')});
                    scope.reloadProductImage(product);
                });
            }
            else {
                scope.reloadProductImage(product);
            }
        }

        scope.reloadProductImage = function (product) {
            SearchService.getProductImage(product.id, product.images)
                .then(function (img) {
                    for (var i = 0; i < scope.products.length; i++) {
                        if (scope.products[i].product.id === img.index) {
                            scope.products[i].product.img = "data:image/jpeg;base64," + img.document_content;
                        }
                    }
                });
        }

        scope.reloadStockProductImage = function (stockId, imageId) {
            scope.loadImage = q.defer();
            FarmerService.getStockProductImage(stockId, imageId).then(function imgArrived(data) {
                scope.loadImage.resolve();
                for (var j = 0; j < scope.products.length; j++) {
                    if (scope.products[j].stockItemId === data.index) {
                        scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
                    }
                }
            }).catch(function () {
                scope.loadImage.reject();
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

        scope.saveAdvertisingChanges = function () {
            console.log("Saving advertising changes!");
            FarmerService.updateAdvertisingInfo(scope.farmer.id, {
                    advertisingTitle: scope.farmer.advertisingTitle,
                    advertisingText: scope.farmer.advertisingText,
                }
            ).then(function (data) {
                Notification.success({message: filter('translate')('ADVERTISING_INFO_UPDATED')});
            }).catch(function (data) {
                Notification.error({message: filter('translate')('ADVERTISING_INFO_NOT_UPDATED')});
            });
        }

        scope.uploadProfilePicture = function () {
            if (typeof scope.profilePic.flow.files !== 'undefined') {
                scope.uploadAdvertisingImage = q.defer();
                FarmerService.uploadFarmerProfileImage(scope.farmer.id,
                    scope.farmer.images.profile ? scope.farmer.images.profile : rootScope.undefinedImageId,
                    scope.profilePic.flow).then(function (data) {
                    scope.uploadAdvertisingImage.resolve();
                    Notification.success({message: filter('translate')('PROFILE_IMAGE_UPLOADED')});
                    scope.profilePic.flow.cancel();
                    scope.loadAdvertisingImage = q.defer();
                    FarmerService.getFarmerImage(scope.farmer.id, data.image)
                        .then(function (img) {
                            scope.loadAdvertisingImage.resolve();
                            scope.farmer.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
                        }).catch(function () {
                        scope.loadAdvertisingImage.reject();
                    });
                }).catch(function (err) {
                    scope.uploadAdvertisingImage.reject();
                    Notification.error({message: filter('translate')('PROFILE_IMAGE_FAILURE')});
                    scope.profilePic.flow.cancel();
                });

            }
        }

        scope.uploadFarmerBannerImage = function (bannerPictureIndex) {
            if (typeof scope.farmer.bannerImages[bannerPictureIndex].flow.files !== 'undefined') {
                scope.uploadAdvertisingImage = q.defer();
                FarmerService.uploadFarmerBannerImage(scope.farmer.id,
                    scope.farmer.bannerImages[bannerPictureIndex].imageId, scope.farmer.bannerImages[bannerPictureIndex].flow).then(function (data) {
                    scope.uploadAdvertisingImage.resolve();
                    Notification.success({message: filter('translate')('BANNER_IMAGE_UPLOADED')});
                    scope.farmer.bannerImages[bannerPictureIndex].flow.cancel();
                    scope.loadAdvertisingImage = q.defer();
                    FarmerService.getFarmerImage(scope.farmer.id, data.image)
                        .then(function (img) {
                            scope.loadAdvertisingImage.resolve();
                            scope.farmer.bannerImages[bannerPictureIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                            scope.farmer.bannerImages[bannerPictureIndex].imageId = img.imageIndex;
                        }).catch(function () {
                        scope.loadAdvertisingImage.reject();
                    });
                }).catch(function (err) {
                    scope.uploadAdvertisingImage.resolve();
                    Notification.error({message: filter('translate')('BANNER_IMAGE_FAILURE')});
                    scope.farmer.bannerImages[bannerPictureIndex].flow.cancel();
                });

            }
        }


        scope.updatePrices = function () {
            scope.updatePricesDeffered = q.defer();
            var pricesObj = {
                currency: rootScope.defaultCurrency.id,
                prices: []
            };

            for (var i in rootScope.transportDistances) {
                for (var j in rootScope.transportWeights) {
                    console.log("i = "+i +", j = "+j);
                    console.log("weight "+rootScope.transportWeights[j]);
                    console.log("dist  "+rootScope.transportDistances[j]);
                    console.log("price " +  scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]]);
                    pricesObj.prices.push({
                        weight: rootScope.transportWeights[j],
                        distance: rootScope.transportDistances[i],
                        price: scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]]
                    });
                }
            }

            FarmerService.updatePrices(scope.farmer.id, pricesObj).then(function (data) {
                Notification.success({message: filter('translate')('PRICES_UPDATED')});
                scope.updatePricesDeffered.resolve();
            }).catch(function () {
                Notification.error({message: filter('translate')('PRICES_NOT_UPDATED')});
                scope.updatePricesDeffered.reject();
            });

        }

        _convertWorkHoursStringToObj = function (workHoursStrings) {

            scope.workHours.push(_convertDayStringToObj(workHoursStrings.mon, 'MONDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.tue, 'TUESDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.wed, 'WEDNESDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.thu, 'THURSDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.fri, 'FRIDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.sat, 'SATURDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.sun, 'SUNDAY'));
        }

        _convertWorkHoursObjectToStrings = function (workHours) {
            var retObj = {};
            for (var i = 0; i < workHours.length; i++) {
                if (i == 0) {
                    retObj.mon = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 1) {
                    retObj.tue = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 2) {
                    retObj.wed = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 3) {
                    retObj.thu = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 4) {
                    retObj.fri = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 5) {
                    retObj.sat = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 6) {
                    retObj.sun = _convertDayWorkHoursToStrings(workHours[i]);
                }
            }
            return retObj;
        }

        _convertDayStringToObj = function (day, dayName) {
            if (day == null) {
                return {
                    name: dayName,
                    checked: false,
                    from: {
                        time: new Date(new Date().setHours(8, 0, 0, 0))
                    },
                    to: {
                        time: new Date(new Date().setHours(9, 0, 0, 0)),
                        minTime: new Date(new Date().setHours(8, 0, 0, 0))
                    }
                };
            } else {
                var retObj = {
                    name : dayName,
                    checked : true,
                    from : {},
                    to : {}
                }
                if (day.length > 1) {
                    var timeString = day.split('-');
                    var fromStrings = timeString[0].split(':');
                    var toStrings = timeString[1].split(':');
                    retObj.from.time = new Date(new Date().setHours(parseInt(fromStrings[0]), parseInt(fromStrings[1]), 0, 0));
                    retObj.to.time = new Date(new Date().setHours(parseInt(toStrings[0]), parseInt(toStrings[1]), 0, 0));
                    retObj.to.minTime = new Date(new Date().setHours(parseInt(fromStrings[0]), parseInt(fromStrings[1]), 0, 0));
                }
                return retObj;
            }
        }

        _convertDayWorkHoursToStrings = function (dayObj) {
            console.log(dayObj);
            if (dayObj.checked == false){
                return null;
            } else {
                return filter('date')(dayObj.from.time, scope.timeFormat) +
                "-" + filter('date')(dayObj.to.time, scope.timeFormat);
            }
        }


        scope.saveConstraints = function () {
            var obj = {
                workHours : _convertWorkHoursObjectToStrings(scope.workHours),
                minOrderPrice : scope.farmer.minOrderPrice
            }
            scope.loadGeneralDeffered = q.defer();
            FarmerService.saveWorkHours(scope.farmer.id,obj).then(function(){
                Notification.success({message: filter('translate')('WORK_HOURS_UPDATED')});
                scope.loadGeneralDeffered.resolve();
            }).catch(function(){
                Notification.error({message: filter('translate')('WORK_HOURS_NOT_UPDATED')});
                scope.loadGeneralDeffered.resolve();
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
                    },
                    SearchService: function () {
                        return SearchService;
                    },
                    FarmerService: function () {
                        return FarmerService;
                    }
                }
            });

            modalInstance.result.then(function (returnJson) {
                if (typeof returnJson !== 'undefined') {
                    var found = false;
                    var newImage = returnJson.image.flow;
                    var productNew = returnJson.info;
                    console.log(returnJson);
                    angular.forEach(scope.products, function (product) {
                        if (product.product.id == productNew.product.id) {
                            found = true;
                            scope.saveInfo = q.defer();
                            FarmerService.updateProduct(routeParams.id, productNew).then(function () {
                                scope.saveInfo.resolve();
                                Notification.success({message: filter('translate')('PRODUCT_UPDATED')});
                                scope.uploadStockProductImage(productNew.product, productNew.stockItemId, productNew.customImage ? productNew.customImage : rootScope.undefinedImageId, newImage);
                                product.amount = productNew.amount;
                                product.price.price = productNew.price.newPrice;
                            }).catch(function () {
                                scope.saveInfo.reject();
                                Notification.error({message: filter('translate')('PRODUCT_NOT_UPDATED')});
                            });
                        }
                    });
                    if (found == false) {
                        scope.saveInfo = q.defer();
                        FarmerService.addNewProduct(routeParams.id, productNew).then(function (newProdData) {
                            scope.saveInfo.resolve();
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
                                        newProd.stockItemId = newProdData.id;
                                        newProd.price.price = productNew.price.newPrice;
                                        newProd.amount = parseFloat(newProd.amount).toFixed(2);
                                        scope.products.push(newProd);
                                        scope.uploadStockProductImage(newProd.product, newProd.stockItemId, rootScope.undefinedImageId, newImage);
                                    }
                                });

                            });
                        }).catch(function () {
                            scope.saveInfo.reject();
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
                    farmer: function () {
                        return scope.farmer;
                    },
                    orders: function () {
                        return scope.orders;
                    },
                    order: function () {
                        return order;
                    },
                    FarmerService: function () {
                        return FarmerService;
                    }
                }
            });
        };
    }]);

angular.module('paysApp').controller('ProductModalInstanceCtrl', function ($scope, $rootScope, $filter, $modalInstance, products, product, SearchService, FarmerService, Notification) {
    $scope.productImage = {
        flow: null
    }
    $scope.newProduct = false
    $scope.productNew = $.extend({}, product);
    $scope.availableProducts = [];
    $scope.productPrice = 0;
    $scope.productAmount = 0;
    angular.forEach($rootScope.allProducts, function (product) {
        var found = false;
        angular.forEach(products, function (compProd) {
            if (compProd.product.id == product.id) {
                found = true;
            }
        });
        if (found == false) {
            $scope.availableProducts.push(product);
        }
    });
    if (typeof product === 'undefined') {
        $scope.newProduct = true;
        $scope.productNew.price = {};
        $scope.productNew.product = {};
        $scope.productNew.price.currency = $rootScope.defaultCurrency;
        $scope.productNew.price.price = 0;
        $scope.productNew.amount = 0;

    } else {
        $scope.productNew.price.price = parseFloat($scope.productNew.price.price);
        $scope.productNew.amount = parseFloat($scope.productNew.amount);
        $scope.productPrice = parseFloat($scope.productNew.price.price);
        $scope.productAmount = parseFloat($scope.productNew.amount);
    }

    $scope.onProductNameChanged = function () {
        SearchService.getProductImage($scope.productNew.product.id, $scope.productNew.product.images).then(function imgArrived(data) {
            if ($scope.productNew.product.id === data.index) {
                $scope.productNew.product.img = "data:image/jpeg;base64," + data.document_content;
            }
        });
    }

    $scope.canBeSaved = function () {
        var retValue = false;
        if (($scope.productPrice > 0 || $scope.productAmount > 0)
            && (typeof $scope.productNew.product.id != 'undefined')) {
            retValue = true;
        }
        return retValue;
    }

    $scope.revertToDefaultImage = function () {
        FarmerService.deleteStockProductImage($scope.productNew.stockItemId).then(function () {
            Notification.success({message: $filter('translate')('PRODUCT_IMAGE_REVERTED')});
            $scope.productNew.customImage = null;
            SearchService.getProductImage($scope.productNew.product.id, $scope.productNew.product.images).then(function imgArrived(data) {
                if ($scope.productNew.product.id === data.index) {
                    $scope.productNew.product.img = "data:image/jpeg;base64," + data.document_content;
                }
            });
        }).catch(function () {
            Notification.error({message: $filter('translate')('PRODUCT_IMAGE_NOT_REVERTED')});
        });
    }
    $scope.saveChanges = function () {
        console.log($scope.productNew);
        $scope.productNew.price.newPrice = $scope.productPrice;
        $scope.productNew.amount = "" + $scope.productAmount;
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

angular.module('paysApp').controller('OrderModalInstanceCtrl', function ($scope, $filter, $modalInstance, $q, farmer, orders, order, FarmerService, Notification) {

    $scope.orders = orders;
    $scope.order = order;
    $scope.order.totalMass = 0;
    $scope.farmerName = farmer.businessSubject.name;
    console.log(farmer.businessSubject);
    for (var i = 0; i < order.items.length; i++) {
        $scope.order.totalMass += parseInt(order.items[i].product.avgWeight);
    }
    $scope.qr = {};

    $scope.qrGenerationDeffered = null;
    check = function () {
        if (($scope.qr.content == null) && (document.getElementsByClassName("qrcode-link").length > 0)) {
            var qrElement = angular.element(document.getElementsByClassName("qrcode-link"));
            $scope.qr.content = qrElement[0].attributes['href'].value;
            $scope.qrGenerationDeffered.resolve();
        }
        else {
            setTimeout(check, 100); // check again in a second
        }
    }

    if (order.status != 'C' && order.status != 'A') {
        $scope.qrGenerationDeffered = $q.defer();
        $scope.qr.packagesNumber = order.packageNumber;
        $scope.qr.img = FarmerService.generateOrderQRCode(order, farmer, order.packageNumber);
        check();
        console.log("QR data generated: " + $scope.qr.img);
    }
    $scope.generateQr = function () {
        $scope.qrGenerationDeffered = $q.defer();
        FarmerService.setTransportOrderStatus(farmer.id, order.id, $scope.qr.packagesNumber).then(function (data) {
            Notification.success({message: $filter('translate')('ORDER_STATUS_TRANSPORT')});
            $scope.order.status = "T";
            $scope.qr.img = FarmerService.generateOrderQRCode(order, farmer, $scope.qr.packagesNumber);
            check();
        }).catch(function () {
            $scope.qrGenerationDeffered.reject();
            Notification.error({message: $filter('translate')('NOT_ORDER_STATUS_TRANSPORT')});
        });
    }

    $scope.printQR = function (divName) {
        var printDiv = document.getElementById(divName).innerHTML;
        var printContents = "";
        for (var i = 0; i < $scope.qr.packagesNumber; i++) {
            var prefix = '<div style="border: dashed;padding: 50px;margin-bottom: 80px; margin-top: 30px;width: 40%; text-align :center;' + (i == ($scope.qr.packagesNumber - 1) ? '' : 'page-break-after: always')
                + '"> <div style="margin-bottom: 50px;">' + printDiv + '</div>';
            prefix += '<h5><strong>Id : </strong>' + $scope.order.id + ' </h5>';
            prefix += '<h5><strong> ' + $filter('translate')('COMPANY_NAME') + ': </strong> ' + $scope.farmerName + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('NUMBER_OF_PACKAGES') + ': </strong> ' + (i + 1) + '/' + $scope.qr.packagesNumber + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('TOTAL_MASS') + ': </strong> ' + $scope.order.totalMass + ' [kg]</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('CLIENT_NAME') + ': </strong> ' + $scope.order.client.privateSubject.name + ' ' + $scope.order.client.privateSubject.lastName + '</h5>';
            if(!$scope.order.deliveryPlace) {
                prefix += '<h5><strong> ' + $filter('translate')('CITY') + ': </strong> ' + $scope.order.address.city + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('POSTAL_CODE') + ': </strong> ' + $scope.order.address.postalCode + '</h5>';
                prefix += '<h5><strong> ' + $filter('translate')('STREET') + ' </strong> ' + $scope.order.address.street + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('HOUSE_NUMBER') + ' </strong> ' + $scope.order.address.houseNumber + '</h5>';
                if ($scope.order.address.floor && $scope.order.address.apartmentNumber) {
                    prefix += '<h5>';
                    if ($scope.order.address.floor) {
                        prefix += '<strong> ' + $filter('translate')('FLOOR') + ' </strong> ' + $scope.order.address.floor;
                    }
                    prefix += ' &nbsp; ';
                    if ($scope.order.address.apartmentNumber) {
                        prefix += '<strong> ' + $filter('translate')('APARTMENT') + ' </strong> ' + $scope.order.address.apartmentNumber;
                    }
                    prefix += '</h5>';
                }
            } else {
                prefix += '<h5><strong> ' + $filter('translate')('CITY') + ': </strong> ' + $scope.order.deliveryPlace.address.city + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('POSTAL_CODE') + ': </strong> ' + $scope.order.deliveryPlace.address.postalCode + '</h5>';
                prefix += '<h5><strong> ' + $filter('translate')('STREET') + ' </strong> ' + $scope.order.deliveryPlace.address.street + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('HOUSE_NUMBER') + ' </strong> ' + $scope.order.deliveryPlace.address.houseNumber + '</h5>';
                if ($scope.order.deliveryPlace.address.floor && $scope.order.deliveryPlace.address.apartmentNumber) {
                    prefix += '<h5>';
                    if ($scope.order.deliveryPlace.address.floor) {
                        prefix += '<strong> ' + $filter('translate')('FLOOR') + ' </strong> ' + $scope.order.deliveryPlace.address.floor;
                    }
                    prefix += ' &nbsp; ';
                    if ($scope.order.deliveryPlace.address.apartmentNumber) {
                        prefix += '<strong> ' + $filter('translate')('APARTMENT') + ' </strong> ' + $scope.order.deliveryPlace.address.apartmentNumber;
                    }
                    prefix += '</h5>';
                }
            }
            prefix += '<h5><strong> ' + $filter('translate')('DELIVERY_DATE') + ': </strong> ' + $scope.order.deliveryDate + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('DELIVERY_TIME') + ': </strong> ' + $scope.order.deliveryFrom + ' - ' + $scope.order.deliveryTo + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('NOTE') + ': </strong> ' + $scope.order.comment +'</h5></div></div>';
            printContents += prefix;
        }

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="style.css" />' +
                '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

});

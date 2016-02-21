/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editFarmerCtrl", ["$scope", "$rootScope", "$q", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService", "FarmerService", "Notification",
  function (scope, rootScope, q, filter, modal, routeParams, CartService, WishlistService, SearchService, FarmerService, Notification) {

    console.log("edit Distributor:  " + routeParams.id);

    scope.page       = 'GENERAL_FARMER_DATA';
    scope.products   = [];
    scope.orders     = [];
    scope.prices     = [];
    scope.profilePic = {
      flow: null
    };

    scope.sortTypeProduct    = "product.name.localization[currentLang]";
    scope.sortReverseProduct = false;

    scope.sortTypeOrder    = "id";
    scope.sortReverseOrder = true;

    scope.loadGeneralDeffered     = null;
    scope.loadVehicleDeffered     = null;
    scope.loadAdvertisingDeffered = null;
    scope.loadPricesDeffered      = null;
    scope.loadOrdersDeffered      = null;

    scope.loadGeneralDeffered     = q.defer();

    SearchService.getFarmerById(routeParams.id).then(function (data) {
      scope.farmer              = data;
      scope.farmer.bannerImages = [];
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
      if((scope.farmer.images.profile != null) || (scope.farmer.images.banner.length)) {
        scope.loadAdvertisingDeffered = q.defer();
        var advertisingPromises       = 0;
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
        var bannerPicIndex  = 0;
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
    scope.loadProductsDeffered    = q.defer();
    SearchService.getFarmerProducts(routeParams.id).then(function (data) {
      scope.products      = data;
      if(scope.products.length == 0){
        scope.loadProductsDeffered.resolve();
      } else {
        var productPromises = 0;
        for (var i = 0; i < scope.products.length; i++) {
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
          }
          productPromises++;
        }
      }
    }).catch(function () {
      scope.loadProductsDeffered.reject();
    });

    scope.loadOrdersDeffered = q.defer();
    SearchService.getFarmerOrders(routeParams.id).then(function (data) {
      scope.orders       = [];
      var clientIds = [];
      angular.forEach(data, function (order) {
        if (order.status != 'C') {
          order.totalPrice = parseFloat(order.totalPrice);
          order.numericStatus = rootScope.getNumericOrderStatus(order.status);
          scope.orders.push(order);
          if (clientIds.indexOf(order.orderedBy) == -1) {
            clientIds.push(order.orderedBy);
          }
        }
      });
      if(clientIds.length == 0){
        scope.loadOrdersDeffered.resolve();
      }else {
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
    FarmerService.getPrices(routeParams.id).then(function (data) {
      if (data.prices && data.prices.length > 0) {
        angular.forEach(data.prices, function (price) {
          if (!scope.prices[price.distance]) {
            scope.prices[price.distance]               = new Array();
            scope.prices[price.distance][price.weight] = parseFloat(price.price);
          } else {
            scope.prices[price.distance][price.weight] = parseFloat(price.price);
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
      scope.loadPricesDeffered.resolve();
    }).catch(function (err) {
      for (var i in rootScope.transportDistances) {
        scope.prices[rootScope.transportDistances[i]] = [];
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

    scope.updateProduct = function (product) {
      scope.openProductModal(product)
    }

    scope.addProduct = function () {
      scope.openProductModal()
    }

    scope.uploadStockProductImage = function (product, stockId, imageId, flow) {
      if ((typeof flow.files !== 'undefined') && (flow.files.length > 0)) {
        FarmerService.uploadStockProductImage(stockId, imageId, flow).then(function (data) {
          Notification.success({message: filter('translate')('PRODUCT_IMAGE_UPLOADED')});
          scope.reloadStockProductImage(stockId, data.image);
          //Update product customImage ID
          angular.forEach(scope.products, function (prod) {
            if (product.id == prod.product.id) {
              prod.customImage = data.image;
            }
          });
        }).catch(function (err) {
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
      FarmerService.getStockProductImage(stockId, imageId).then(function imgArrived(data) {
        for (var j = 0; j < scope.products.length; j++) {
          if (scope.products[j].stockItemId === data.index) {
            scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
          }
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


    scope.updatePrices = function () {
      scope.updatePricesDeffered = q.defer();
      var pricesObj              = {
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
        scope.updatePricesDeffered.resolve();
      }).catch(function () {
        Notification.error({message: filter('translate')('PRICES_NOT_UPDATED')});
        scope.updatePricesDeffered.reject();
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
          var found      = false;
          var newImage   = returnJson.image.flow;
          var productNew = returnJson.info;
          console.log(returnJson);
          angular.forEach(scope.products, function (product) {
            if (product.product.id == productNew.product.id) {
              found = true;
              FarmerService.updateProduct(routeParams.id, productNew).then(function () {
                Notification.success({message: filter('translate')('PRODUCT_UPDATED')});
                scope.uploadStockProductImage(productNew.product, productNew.stockItemId, productNew.customImage ? productNew.customImage : rootScope.undefinedImageId, newImage);
                product = productNew;

              }).catch(function () {
                Notification.error({message: filter('translate')('PRODUCT_NOT_UPDATED')});
              });
            }
          });
          if (found == false) {
            FarmerService.addNewProduct(routeParams.id, productNew).then(function (newProdData) {
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
                    scope.products.push(newProd);
                    scope.uploadStockProductImage(newProd.product, newProd.stockItemId, rootScope.undefinedImageId, newImage);
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

angular.module('paysApp').controller('ProductModalInstanceCtrl', function ($scope, $rootScope, $filter, $modalInstance, products, product, SearchService, FarmerService) {
  $scope.productImage      = {
    flow: null
  }
  $scope.newProduct        = false
  $scope.productNew        = $.extend({}, product);
  $scope.availableProducts = [];
  console.log(products);
  console.log($rootScope.allProducts);
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
    $scope.newProduct                = true;
    $scope.productNew.price          = {};
    $scope.productNew.product        = {};
    $scope.productNew.price.currency = $rootScope.defaultCurrency;
    $scope.productNew.price.price    = 0;
    $scope.productNew.amount         = 0;

  } else {
    $scope.productNew.price.price = parseFloat($scope.productNew.price.price);
    $scope.productNew.amount      = parseFloat($scope.productNew.amount);
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
    if (($scope.productNew.price.price > 0 || $scope.productNew.amount > 0)
      && (typeof $scope.productNew.product.id != 'undefined')) {
      retValue = true;
    }
    return retValue;
  }

  $scope.revertToDefaultImage = function () {
    FarmerService.deleteStockProductImage($scope.productNew.stockItemId).then(function () {
    });
  }
  $scope.saveChanges          = function () {
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

angular.module('paysApp').controller('OrderModalInstanceCtrl', function ($scope, $filter, $modalInstance, farmer, orders, order, FarmerService, Notification) {

  $scope.orders = orders;
  $scope.order  = order;

  $scope.qr = {};

  check = function () {
    if (($scope.qr.content == null) && (document.getElementsByClassName("qrcode-link").length > 0)) {
      var qrElement     = angular.element(document.getElementsByClassName("qrcode-link"));
      $scope.qr.content = qrElement[0].attributes['href'].value;
    }
    else {
      setTimeout(check, 100); // check again in a second
    }
  }

  if (order.status != 'C' && order.status != 'A') {
    $scope.qr.packagesNumber = order.packageNumber;
    $scope.qr.img = FarmerService.generateOrderQRCode(order, farmer, order.packageNumber);
    check();
    console.log("QR data generated: " + $scope.qr.img);
  }
  $scope.generateQr = function () {
    FarmerService.setTransportOrderStatus(farmer.id, order.id, $scope.qr.packagesNumber).then(function (data) {
      Notification.success({message: $filter('translate')('ORDER_STATUS_TRANSPORT')});
      $scope.order.status = "T";
      $scope.qr.img       = FarmerService.generateOrderQRCode(order, farmer, $scope.qr.packagesNumber);
      check();
    }).catch(function () {
      Notification.error({message: $filter('translate')('NOT_ORDER_STATUS_TRANSPORT')});
    });
  }

  $scope.printQR = function(divName) {
    var printDiv = document.getElementById(divName).innerHTML;
    var printContents = "";
    for(var i=0;i<$scope.qr.packagesNumber;i++){
      printContents += printDiv;
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

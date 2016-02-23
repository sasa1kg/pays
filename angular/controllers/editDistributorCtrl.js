/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$rootScope", "$q", "$filter", "$modal", "$routeParams",
  "CartService", "WishlistService", "SearchService", "DistributorService", "Notification",
  function (scope, rootScope, q, filter, modal, routeParams, CartService, WishlistService, SearchService, DistributorService, Notification) {


    var distributorId = routeParams.id;
    console.log("edit Distributor:  " + distributorId);

    scope.page       = 'GENERAL_DISTRIBUTOR_DATA';
    scope.vehicles   = [];
    scope.prices     = [];
    scope.profilePic = {
      flow: null
    };

    scope.sortType    = "name";
    scope.sortReverse = false;

    scope.loadGeneralDeffered     = null;
    scope.loadVehicleDeffered     = null;
    scope.loadAdvertisingDeffered = null;
    scope.loadPricesDeffered      = null;
    scope.saveInfo                = null;
    scope.uploadImage             = null;
    scope.loadImage               = null;
    scope.uploadAdvertisingImage  = null;
    scope.loadAdvertisingImage    = null;

    scope.sectionChange       = function (sectionName) {
      scope.page = sectionName;
    }
    scope.loadGeneralDeffered = q.defer();
    DistributorService.getDistributorById(distributorId).then(function (data) {
      scope.distributor              = data;
      scope.distributor.bannerImages = [];
      scope.loadGeneralDeffered.resolve();
      //Initialize array for banner images
      for (var i = 0; i < rootScope.bannerPicsLimit; i++) {
        scope.distributor.bannerImages[i] = {
          flow: null,
          imageId: rootScope.undefinedImageId,
          imgData: ""
        };
      }
      ;
      if ((scope.distributor.images.profile != null) || (scope.distributor.images.banner.length)) {
        scope.loadAdvertisingDeffered = q.defer();
        var advertisingPromises       = 0;
        if (scope.distributor.images.profile != null) {
          DistributorService.getDistributorImage(distributorId, scope.distributor.images.profile)
            .then(function (img) {
              advertisingPromises--;
              if (advertisingPromises == 0) {
                scope.loadAdvertisingDeffered.resolve();
              }
              scope.distributor.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
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
        for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.distributor.images.banner.length)); i++) {
          scope.distributor.bannerImages[bannerLoadIndex++].imageId = scope.distributor.images.banner[scope.distributor.images.banner.length - (i + 1)];
          DistributorService.getDistributorImage(distributorId, scope.distributor.images.banner[scope.distributor.images.banner.length - (i + 1)])
            .then(function (img) {
              advertisingPromises--;
              if (advertisingPromises == 0) {
                scope.loadAdvertisingDeffered.resolve();
              }
              if (img.type != 'undefined') {
                for (var j = 0; j < scope.distributor.bannerImages.length; j++) {
                  if (scope.distributor.bannerImages[j].imageId == img.imageIndex) {
                    scope.distributor.bannerImages[bannerPicIndex].imgData = "data:image/jpeg;base64," + img.document_content;
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
          ;
          advertisingPromises++;
        }
      }
    }).catch(function () {
      scope.loadGeneralDeffered.reject();
    });
    scope.loadVehicleDeffered = q.defer();
    DistributorService.getVehiclesByDistributorId(distributorId).then(function (data) {
      scope.vehicles = data;
      if (scope.vehicles.length == 0) {
        scope.loadVehicleDeffered.resolve();
      } else {
        var vehiclePromises = 0;
        for (var j = 0; j < scope.vehicles.length; j++) {
          if (scope.vehicles[j].images) {
            DistributorService.getVehicleImage(scope.vehicles[j].id, scope.vehicles[j].images)
              .then(function (img) {
                vehiclePromises--;
                if (vehiclePromises == 0) {
                  scope.loadVehicleDeffered.resolve();
                }
                for (var i = 0; i < scope.vehicles.length; i++) {
                  if (scope.vehicles[i].id === img.index) {
                    scope.vehicles[i].img = "data:image/jpeg;base64," + img.document_content;
                  }
                }
              }).catch(function () {
                vehiclePromises--;
                if (vehiclePromises == 0) {
                  scope.loadVehicleDeffered.resolve();
                }
              });
            vehiclePromises++;
          }
        }
        if (vehiclePromises == 0) {
          scope.loadVehicleDeffered.resolve();
        }
      }
    }).catch(function () {
      scope.loadVehicleDeffered.reject();
    });
    scope.loadPricesDeffered  = q.defer();
    DistributorService.getPrices(routeParams.id).then(function (data) {
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
      scope.loadPricesDeffered.resolve();
    }).catch(function () {
      scope.loadPricesDeffered.reject();
    });
    ;

    scope.saveGeneralChanges = function () {
      console.log("Saving general changes!");
      DistributorService.updateGeneralInfo(scope.distributor.id,
        {
          businessSubject: scope.distributor.businessSubject
        }
      ).then(function (data) {
          console.log(data);
          Notification.success({message: filter('translate')('GENERAL_INFO_UPDATED')});
        }).catch(function (err) {
          console.error(err);
          Notification.error({message: filter('translate')('GENERAL_INFO_NOT_UPDATED')});
        })
    }

    scope.saveAdvertisingChanges = function () {
      console.log("Saving advertising changes!");
      DistributorService.updateAdvertisingInfo(scope.distributor.id, {
          advertisingTitle: scope.distributor.advertisingTitle,
          advertisingText: scope.distributor.advertisingText,
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
        DistributorService.uploadDistributorProfileImage(scope.distributor.id,
          scope.distributor.images.profile ? scope.distributor.images.profile : rootScope.undefinedImageId,
          scope.profilePic.flow).then(function (data) {
            scope.uploadAdvertisingImage.resolve();
            Notification.success({message: filter('translate')('PROFILE_IMAGE_UPLOADED')});
            scope.profilePic.flow.cancel();
            scope.loadAdvertisingImage = q.defer();
            DistributorService.getDistributorImage(distributorId, data.image)
              .then(function (img) {
                scope.loadAdvertisingImage.resolve();
                scope.distributor.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
              }).catch(function(){
                scope.loadAdvertisingImage.reject();
              });
          }).catch(function (err) {
            scope.uploadAdvertisingImage.reject();
            Notification.error({message: filter('translate')('PROFILE_IMAGE_FAILURE')});
            scope.profilePic.flow.cancel();
          });

      }
    }

    scope.uploadDistributorBannerImage = function (bannerPictureIndex) {
      console.log("uploadDistributorBannerImage" + bannerPictureIndex);
      if (typeof scope.distributor.bannerImages[bannerPictureIndex].flow.files !== 'undefined') {
        scope.uploadAdvertisingImage = q.defer();
        DistributorService.uploadDistributorBannerImage(scope.distributor.id,
          scope.distributor.bannerImages[bannerPictureIndex].imageId, scope.distributor.bannerImages[bannerPictureIndex].flow).
          then(function (data) {
            scope.uploadAdvertisingImage.resolve();
            Notification.success({message: filter('translate')('BANNER_IMAGE_UPLOADED')});
            scope.distributor.bannerImages[bannerPictureIndex].flow.cancel();
            scope.loadAdvertisingImage = q.defer();
            DistributorService.getDistributorImage(distributorId, data.image)
              .then(function (img) {
                scope.loadAdvertisingImage.resolve();
                scope.distributor.bannerImages[bannerPictureIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                scope.distributor.bannerImages[bannerPictureIndex].imageId = img.imageIndex;
              }).catch(function(){
                scope.loadAdvertisingImage.reject();
              });
          }).catch(function (err) {
            scope.uploadAdvertisingImage.reject();
            Notification.error({message: filter('translate')('BANNER_IMAGE_FAILURE')});
            scope.distributor.bannerImages[bannerPictureIndex].flow.cancel();
          });

      }
    }

    scope.deleteVehicle = function (vehicle) {
      DistributorService.deleteVehicle(distributorId, vehicle.id).then(function (data) {
        Notification.success({message: filter('translate')('VEHICLE_DELETED')});
        var idx = scope.vehicles.indexOf(vehicle);
        if (idx >= 0) {
          scope.vehicles.splice(idx, 1);
        }
      }).catch(function (data) {
        Notification.error({message: filter('translate')('VEHICLE_NOT_DELETED')});
      });

    }

    scope.updateVehicle = function (vehicle) {
      scope.openVehicleModal(vehicle)
    }

    scope.addVehicle = function () {
      scope.openVehicleModal()
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

      DistributorService.updatePrices(distributorId, pricesObj).then(function (data) {
        Notification.success({message: filter('translate')('PRICES_UPDATED')});
        scope.updatePricesDeffered.resolve();
      }).catch(function () {
        Notification.error({message: filter('translate')('PRICES_NOT_UPDATED')});
        scope.updatePricesDeffered.reject();
      });

    }


    scope.uploadVehiclePicture = function (vehicleId, imageId, flow) {
      if ((typeof flow.files !== 'undefined') && (flow.files.length > 0)) {
        scope.uploadImage = q.defer();
        DistributorService.uploadVehicleImage(vehicleId, imageId, flow).then(function (data) {
          scope.uploadImage.resolve();
          Notification.success({message: filter('translate')('VEHICLE_IMAGE_UPLOADED')});
          scope.reloadVehicleImage(vehicleId, data.image);
        }).catch(function (err) {
          scope.uploadImage.reject();
          Notification.error({message: filter('translate')('VEHICLE_IMAGE_FAILURE')});
        });
      }
    }

    scope.reloadVehicleImage = function (vehicleId, imageId) {
      scope.loadImage = q.defer();
      DistributorService.getVehicleImage(vehicleId, imageId)
        .then(function (img) {
          scope.loadImage.resolve();
          for (var i = 0; i < scope.vehicles.length; i++) {
            if (scope.vehicles[i].id === img.index) {
              scope.vehicles[i].img = "data:image/jpeg;base64," + img.document_content;
            }
          }
        }).catch(function () {
          scope.loadImage.reject();
        });
    }

    scope.openVehicleModal = function (vehicle) {

      var modalInstance = modal.open({
        animation: true,
        templateUrl: 'vehicleEditModal.html',
        controller: 'UpdateVehicleModalCtrl',
        size: 'sm',
        resolve: {
          vehicles: function () {
            return scope.vehicles;
          },
          vehicle: function () {
            return vehicle;
          }
        }
      });
      modalInstance.result.then(function (returnJson) {
        if (typeof returnJson !== 'undefined') {
          var found      = false;
          var newImage   = returnJson.image.flow;
          var vehicleNew = returnJson.info;

          angular.forEach(scope.vehicles, function (vehicle) {
            if (vehicle.id == vehicleNew.id) {
              found          = true;
              scope.saveInfo = q.defer();
              DistributorService.updateVehicle(distributorId, vehicleNew).then(function () {
                Notification.success({message: filter('translate')('VEHICLE_UPDATED')});
                scope.saveInfo.resolve();
                scope.uploadVehiclePicture(vehicleNew.id, vehicleNew.images ? vehicleNew.images : rootScope.undefinedImageId, newImage);
                vehicle.cooled  = vehicleNew.cooled;
                vehicle.maxMass = vehicleNew.maxMass;
                vehicle.depth   = vehicleNew.depth;
                vehicle.width   = vehicleNew.width;
                vehicle.height  = vehicleNew.height;
                vehicle.name    = vehicleNew.name;
                vehicle.number  = vehicleNew.number;
              }).catch(function () {
                scope.saveInfo.reject();
                Notification.error({message: filter('translate')('VEHICLE_NOT_UPDATED')});
              });
            }
          });
          if (found == false) {
            scope.saveInfo = q.defer();
            DistributorService.addNewVehicle(distributorId, vehicleNew).then(function () {
              Notification.success({message: filter('translate')('VEHICLE_ADDED')});
              scope.saveInfo.resolve();
              DistributorService.getVehiclesByDistributorId(distributorId).then(function (data) {
                angular.forEach(data, function (newVeh) {
                  var exists = false;
                  for (var j = 0; j < scope.vehicles.length; j++) {
                    if (scope.vehicles[j].id === newVeh.id) {
                      exists = true;
                    }
                  }
                  if (exists == false) {
                    scope.vehicles.push(newVeh);
                    scope.uploadVehiclePicture(newVeh.id, rootScope.undefinedImageId, newImage);
                  }
                });

              });
            }).catch(function () {
              scope.saveInfo.reject();
              Notification.error({message: filter('translate')('VEHICLE_NOT_ADDED')});
            });
          }
        }
      });
    };
  }])
;

angular.module('paysApp').controller('UpdateVehicleModalCtrl', function ($scope, $filter, $modalInstance, vehicles, vehicle) {

  $scope.vehicleImage = {
    flow: null
  }

  var newVehicle    = false
  $scope.vehicleNew = $.extend({}, vehicle);

  $scope.maxMass = 0;
  $scope.depth   = 0;
  $scope.width   = 0;
  $scope.height  = 0;
  $scope.model   = "";
  $scope.number  = 0;
  $scope.cooled  = false;
  if (typeof vehicle === 'undefined') {
    newVehicle = true;
  } else {
    $scope.maxMass = parseFloat($scope.vehicleNew.maxMass);
    $scope.depth   = parseFloat($scope.vehicleNew.depth);
    $scope.width   = parseFloat($scope.vehicleNew.width);
    $scope.height  = parseFloat($scope.vehicleNew.height);
    $scope.model   = "" + $scope.vehicleNew.name;
    $scope.number  = parseFloat($scope.vehicleNew.number);
    $scope.cooled  = $scope.vehicleNew.cooled;
  }

  $scope.saveChanges = function () {
    $scope.vehicleNew.cooled  = stringToBoolean($scope.cooled);
    $scope.vehicleNew.maxMass = $scope.maxMass;
    $scope.vehicleNew.depth   = $scope.depth;
    $scope.vehicleNew.width   = $scope.width;
    $scope.vehicleNew.height  = $scope.height;
    $scope.vehicleNew.name    = $scope.model;
    $scope.vehicleNew.number  = $scope.number;
    var returnJson            = {
      info: $scope.vehicleNew,
      image: $scope.vehicleImage
    };
    if (newVehicle == true) {
      $modalInstance.close(returnJson);
    }
    $modalInstance.close(returnJson);
  }

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.isCooled = function (field, value) {
    if (field == value) {
      return true;
    }
    return false;
  }

  stringToBoolean = function (string) {
    if (typeof string === 'string') {

      switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
          return true;
        case "false":
        case "no":
        case "0":
        case null:
          return false;
        default:
          return Boolean(string);
      }
    }
    return string;
  }
})
;
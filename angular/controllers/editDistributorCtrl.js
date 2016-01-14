/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$rootScope", "$http", "$filter", "$modal", "$routeParams",
  "CartService", "WishlistService", "SearchService", "DistributorService", "Notification",
  function (scope, rootScope, http, filter, modal, routeParams, CartService, WishlistService, SearchService, DistributorService, Notification) {


    var distributorId = routeParams.id;
    console.log("edit Distributor:  " + distributorId);

    scope.page       = 'GENERAL_DISTRIBUTOR_DATA';
    scope.vehicles   = [];
    scope.prices     = [];
    scope.profilePic = {
      flow: null
    };

    //dummy load
    for (var i in rootScope.transportDistances) {
      scope.prices[rootScope.transportDistances[i]] = [];
      for (var j in rootScope.transportWeights) {
        scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = rootScope.transportDistances[i] * rootScope.transportWeights[j];
      }
    }

    scope.sectionChange      = function (sectionName) {
      scope.page = sectionName;
    }

    DistributorService.getDistributorById(distributorId).then(function (data) {
      scope.distributor              = data;
      scope.distributor.bannerImages = [];

      //Initialize array for banner images
      for (var i = 0; i < rootScope.bannerPicsLimit; i++) {
        scope.distributor.bannerImages[i] = {
          flow: null,
          imageId: rootScope.undefinedImageId,
          imgData: ""
        };
      }
      ;

      if (scope.distributor.images.profile != null) {
        DistributorService.getDistributorImage(distributorId, scope.distributor.images.profile)
          .then(function (img) {
            scope.distributor.profilePictureBase64 = "data:" + img.type + ";base64," + img.document_content;
          });
      }
      var bannerPicIndex = 0;
      for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.distributor.images.banner.length)); i++) {
        DistributorService.getDistributorImage(distributorId, scope.distributor.images.banner[scope.distributor.images.banner.length - (i+1)])
          .then(function (img) {
            if (img.type != 'undefined') {
              scope.distributor.bannerImages[bannerPicIndex].imgData = "data:" + img.type + ";base64," + img.document_content;
              scope.distributor.bannerImages[bannerPicIndex].imageId = img.imageIndex;
              bannerPicIndex++
              console.log(JSON.stringify(scope.distributor.bannerImages,null,4));
            }
          }
        )
        ;
      }
    });

    DistributorService.getVehiclesByDistributorId(distributorId).then(function (data) {
      scope.vehicles = data;
      for (var j = 0; j < scope.vehicles.length; j++) {
        if (scope.vehicles[j].images) {
          DistributorService.getVehicleImage(scope.vehicles[j].id, scope.vehicles[j].images)
            .then(function (img) {
              for (var i = 0; i < scope.vehicles.length; i++) {
                if (scope.vehicles[i].id === img.index) {
                  scope.vehicles[i].img = "data:" + img.type + ";base64," + img.document_content;
                }
              }
            });
        }
      }
    });

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
        DistributorService.uploadDistributorProfileImage(scope.distributor.id,
          scope.distributor.images.profile ? scope.distributor.images.profile : rootScope.undefinedImageId,
          scope.profilePic.flow).then(function (data) {
            Notification.success({message: filter('translate')('PROFILE_IMAGE_UPLOADED')});
            scope.profilePic.flow.cancel();
          }).catch(function (err) {
            Notification.error({message: filter('translate')('PROFILE_IMAGE_FAILURE')});
            scope.profilePic.flow.cancel();
          });

      }
    }

    scope.uploadDistributorBannerImage = function (bannerPictureIndex) {
      console.log("uploadDistributorBannerImage" + bannerPictureIndex);
      if (typeof scope.distributor.bannerImages[bannerPictureIndex].flow.files !== 'undefined') {
        DistributorService.uploadDistributorBannerImage(scope.distributor.id,
          scope.distributor.bannerImages[bannerPictureIndex].imageId,scope.distributor.bannerImages[bannerPictureIndex].flow).
          then(function (data) {
            Notification.success({message: filter('translate')('BANNER_IMAGE_UPLOADED')});
            scope.distributor.bannerImages[bannerPictureIndex].flow.cancel();
          }).catch(function (err) {
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

    scope.updatePrices         = function () {
      console.log(scope.prices);
    }
    scope.uploadVehiclePicture = function (vehicleId, imageId, flow) {
      if (typeof flow.files !== 'undefined') {
        DistributorService.uploadVehicleImage(vehicleId, imageId, flow).then(function (data) {
          Notification.success({message: filter('translate')('VEHICLE_IMAGE_UPLOADED')});
          scope.reloadVehicleImage(vehicleId);
        }).catch(function (err) {
          Notification.error({message: filter('translate')('VEHICLE_IMAGE_FAILURE')});
          scope.reloadVehicleImage(vehicleId);
        });
      }
    }

    scope.reloadVehicleImage = function (vehicleId) {
      DistributorService.getVehicleImages(vehicleId).then(function (data) {
        if (data.length > 0) {
          DistributorService.getVehicleImage(vehicleId, data[data.length - 1])
            .then(function (img) {
              for (var i = 0; i < scope.vehicles.length; i++) {
                if (scope.vehicles[i].id === img.index) {
                  scope.vehicles[i].img = "data:" + img.type + ";base64," + img.document_content;
                }
              }
            });
        }
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
              found = true;
              DistributorService.updateVehicle(distributorId, vehicleNew).then(function () {
                Notification.success({message: filter('translate')('VEHICLE_UPDATED')});
                scope.uploadVehiclePicture(vehicleNew.id, vehicleNew.images ? vehicleNew.images : rootScope.undefinedImageId, newImage);
                vehicle = vehicleNew;

              }).catch(function () {
                Notification.error({message: filter('translate')('VEHICLE_NOT_UPDATED')});
              });
            }
          });
          if (found == false) {
            DistributorService.addNewVehicle(distributorId, vehicleNew).then(function () {
              Notification.success({message: filter('translate')('VEHICLE_ADDED')});
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
  if (typeof vehicle === 'undefined') {
    newVehicle = true;
  }

  $scope.saveChanges = function () {
    console.log($scope.vehicleNew);
    $scope.vehicleNew.cooled = stringToBoolean($scope.vehicleNew.cooled);
    var returnJson           = {
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

  $scope.isCooled = function (value) {
    if ($scope.vehicleNew.cooled == value) {
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
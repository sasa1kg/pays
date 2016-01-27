/**
 * Created by nignjatov on 20.11.2015.
 */
var DistributorService = angular.module('DistributorService', []).service('DistributorService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {


        /**
         * Distributor data
         */
        this.getDistributors = function () {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "transporter").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getDistributors | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getDistributors | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getDistributorById = function (distributorId) {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "transporter/" + distributorId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getDistributorById | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getDistributorById | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.updateGeneralInfo = function (distributorId, info) {
            var deffered = q.defer();

            http.put(rootScope.serverURL + "transporter/" + distributorId, info).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updateGeneralInfo | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updateGeneralInfo | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.updateAdvertisingInfo = function (distributorId, info) {
            var deffered = q.defer();

            http.post(rootScope.serverURL + "transporter/" + distributorId + "/advertising", info).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updateAdvertisingInfo | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updateAdvertisingInfo | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        /**
         * Vehicles data
         */

        this.getVehiclesByDistributorId = function (distributorId) {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "transporter/" + distributorId + "/vehicles").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getVehiclesByDistributorId | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getVehiclesByDistributorId | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.addNewVehicle = function (distributorId, vehicle) {
            var deffered = q.defer();

            http.post(rootScope.serverURL + "transporter/" + distributorId + "/vehicles", vehicle).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("addNewVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("addNewVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.updateVehicle = function (distributorId, vehicle) {
            var deffered = q.defer();

            http.put(rootScope.serverURL + "transporter/" + distributorId + "/vehicles/" + vehicle.id, vehicle).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("updateVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.deleteVehicle = function (distributorId, vehicleId) {
            var deffered = q.defer();

            http.delete(rootScope.serverURL + "transporter/" + distributorId + "/vehicles/" + vehicleId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("deleteVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("deleteVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        /**
         * Images handling
         */

        this.getDistributorImage = function (distId, imageId) {
            var deffered = q.defer();
            console.log(rootScope.serverURL  + "transporter/" + distId+"/images/"+imageId+"/imagefile");
            http.get(rootScope.serverURL  + "transporter/" + distId+"/images/"+imageId+"/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = distId;
                      data.imageIndex = imageId;
                      deffered.resolve(data);
                  } else {
                      console.log("getFarmerById |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getVehicleImage = function (vehicleId, imageId) {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "vehicle/" + vehicleId + "/images/" + imageId + "/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = vehicleId;
                      deffered.resolve(data);
                  } else {
                      console.log("getVehicleImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.getVehicleImages = function(vehicleId){
            var deffered = q.defer();

            http.get(rootScope.serverURL + "vehicle/" + vehicleId + "/images").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = vehicleId;
                      deffered.resolve(data);
                  } else {
                      console.log("getVehicleImages |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.uploadVehicleImage = function(vehicleId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"vehicle/"+vehicleId+"/imagefile";
            } else {
                // update current picture of vehicle
                flowObj.opts.target = rootScope.serverURL+"vehicle/"+vehicleId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.uploadDistributorProfileImage = function(distributorId,imageId,flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/imagetype/P/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.uploadDistributorBannerImage = function(distributorId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/imagetype/B/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }
    }]);
var FarmerService = angular.module('FarmerService', []).service('FarmerService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {

        this.updateGeneralInfo = function (farmerId, info) {
            var deffered = q.defer();

            http.put(rootScope.serverURL + "merchant/" + farmerId, info).
                success(function (data, status) {
                    if (status == 200) {
                        console.log("updateGeneralInfo | Status OK " + status);
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

        this.updateAdvertisingInfo = function (farmerId, info) {
            var deffered = q.defer();

            http.post(rootScope.serverURL + "merchant/" + farmerId + "/advertising", info).
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


        this.getProductImage = function (productId, imageId) {
            var deffered = q.defer();

            http.get(rootScope.serverURL + "product/" + productId + "/images/" + imageId + "/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
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

        this.uploadProductImage = function(productId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverImagesURL+"product/"+productId+"/imagefile";
            } else {
                // update current picture of vehicle
                flowObj.opts.target = rootScope.serverImagesURL+"product/"+productId+"/image/"+imageId+"/imagefile";
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

        this.uploadFarmerProfileImage = function(farmerId,imageId,flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverImagesURL+"merchant/"+farmerId+"/imagetype/P/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverImagesURL+"merchant/"+farmerId+"/image/"+imageId+"/imagefile";
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

        this.uploadFarmerBannerImage = function(farmerId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverImagesURL+"merchant/"+farmerId+"/imagetype/B/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverImagesURL+"merchant/"+farmerId+"/image/"+imageId+"/imagefile";
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

        //@url PUT /merchant/$id/products/$productId/amount/$amount/unit/$unitId
        this.updateProduct = function (farmerId, product) {
            var deffered = q.defer();

            http.put(rootScope.serverURL + "merchant/" + farmerId + "/products/" + product.product.id + "/amount/" + product.amount + "/unit/" + product.measure.id).
                success(function (data, status) {
                    if (status == 200) {
                        console.log(data);
                        http.post(rootScope.serverURL + "merchant/" + farmerId + "/products/" + product.product.id +"/pricelist", {
                            "product": product.product.id,
                            "currencyId": product.price.currency.id,
                            "price": product.price.price,
                            "minAmount":100,
                            "from":"2016-01-01",
                            "to":"2017-01-01"
                        }).success(function (data, status) {
                            if (status == 200) {
                                deffered.resolve(data);
                            }
                            else {
                                console.log("updateProduct | Status not OK " + status);
                                deffered.reject("Error");
                            }
                        }).error(function (data, status) {
                                console.log("updateProduct | Error " + status);
                                deffered.reject("Error");
                        });

                    } else {
                        console.log("updateProduct | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateProduct | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.addNewProduct = function (farmerId, product) {
            var deffered = q.defer();

            http.put(rootScope.serverURL + "merchant/" + farmerId + "/products/" + product.product.id + "/amount/" + product.amount + "/unit/" + product.measure.id).
                success(function (data, status) {
                    if (status == 200) {
                        console.log(data);
                        http.post(rootScope.serverURL + "merchant/" + farmerId + "/products/" + product.product.id +"/pricelist", {
                            "product": product.product.id,
                            "currencyId": product.price.currency.id,
                            "price": product.price.price
                        }).success(function (data, status) {
                            if (status == 200) {
                                deffered.resolve(data);
                            }
                            else {
                                console.log("addNewProduct | Status not OK " + status);
                                deffered.reject("Error");
                            }
                        }).error(function (data, status) {
                            console.log("addNewProduct | Error " + status);
                            deffered.reject("Error");
                        });

                    } else {
                        console.log("addNewProduct | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("addNewProduct | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }
    }]);
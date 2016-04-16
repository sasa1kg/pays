var FarmerService = angular.module('FarmerService', []).service('FarmerService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {

        this.QRCodeDataSeparator = "*";

        this.updateGeneralInfo = function (farmerId, info) {
            var deffered = q.defer();

            http.put("merchant/" + farmerId, info).
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

            http.post("merchant/" + farmerId + "/advertising", info).
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

            http.get("product/" + productId + "/images/" + imageId + "/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        deffered.resolve(data);
                    } else {
                        console.log("getProductImage |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });
            return deffered.promise;
        }

        this.getProductImages = function(productId){
            var deffered = q.defer();

            http.get("product/" + productId + "/images").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        deffered.resolve(data);
                    } else {
                        console.log("getProductImages |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });
            return deffered.promise;
        }

        this.getStockProductImage = function(stockId,imageId){
            var deffered = q.defer();

            http.get("stock_item/" + stockId + "/images/"+imageId+"/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = stockId;
                      deffered.resolve(data);
                  } else {
                      console.log("getStockProductImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.uploadStockProductImage = function(stockId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = "stock_item/"+stockId+"/imagefile";
            } else {
                // update current picture of vehicle
                flowObj.opts.target = "stock_item/"+stockId+"/image/"+imageId+"/imagefile";
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

        this.deleteStockProductImage = function(stockId){
            var deffered = q.defer();

            http.delete("stock_item/" + stockId + "/images").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = stockId;
                      deffered.resolve(data);
                  } else {
                      console.log("deleteStockProductImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.uploadFarmerProfileImage = function(farmerId,imageId,flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = "merchant/"+farmerId+"/imagetype/P/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = "merchant/"+farmerId+"/image/"+imageId+"/imagefile";
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
                flowObj.opts.target = "merchant/"+farmerId+"/imagetype/B/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = "merchant/"+farmerId+"/image/"+imageId+"/imagefile";
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

        //@url PUT /merchant/$id/products/$productId/amount/$amount
        this.updateProduct = function (farmerId, product) {
            var deffered = q.defer();

            http.put("merchant/" + farmerId + "/products/" + product.product.id + "/amount/" + product.amount).
                success(function (data, status) {
                    if (status == 200) {
                        console.log(data);
                        http.post("merchant/" + farmerId + "/products/" + product.product.id +"/pricelist", {
                            "product": product.product.id,
                            "currencyId": product.price.currency.id,
                            "price": product.price.newPrice,
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

            http.put("merchant/" + farmerId + "/products/" + product.product.id + "/amount/" + product.amount).
                success(function (data, status) {
                    if (status == 200) {
                        console.log(data);
                        http.post("merchant/" + farmerId + "/products/" + product.product.id +"/pricelist", {
                            "product": product.product.id,
                            "currencyId": product.price.currency.id,
                            "price": product.price.newPrice
                        }).success(function (dataPrice, status) {
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

        this.deleteProduct = function (farmerId, productId) {
            var deffered = q.defer();

            http.delete("merchant/" + farmerId + "/products/" + productId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("deleteProduct | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("deleteProduct | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getFarmerImage = function (farmerId, imageId) {
            var deffered = q.defer();
            http.get("merchant/" + farmerId+"/images/"+imageId+"/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = farmerId;
                      data.imageIndex = imageId;
                      deffered.resolve(data);
                  } else {
                      console.log("getFarmerImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.updatePrices = function(farmerId, pricesData){
            var deffered = q.defer();

            http.post("merchant/" + farmerId + "/transportPricelist", pricesData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updatePrices | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updatePrices | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getPrices = function(farmerId){
            var deffered = q.defer();

            http.get("merchant/" + farmerId + "/transportPricelist").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getPrices | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getPrices | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getReviews = function(farmerId){
            var deffered = q.defer();

            http.get("merchant/" + farmerId + "/reviews").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getReviews | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getReviews | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.setTransportOrderStatus = function(farmerId,orderId,packageNumber) {
            var deffered = q.defer();
            http.put("merchant/" + farmerId + "/orders/" + orderId + "/startTransport/"+packageNumber).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("setTransportOrderStatus | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("setTransportOrderStatus | Error " + status);
                    deffered.reject("Error");
                });
            return deffered.promise;
        }

        this.generateOrderQRCode = function(order, farmer, packageNumber){

            var qrData;
            qrData = {
                id: order.id
            };
            return JSON.stringify(qrData);
        }

        this.getTransportPrice = function(farmerId, priceData){
            var deffered = q.defer();
            http.post("merchant/" + farmerId + "/calculateTransport",priceData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getTransportPrice | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getTransportPrice | Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.saveWorkHours = function(farmerId, hoursData){
            var deffered = q.defer();
            http.post("merchant/" + farmerId + "/deliveryConstraints",hoursData).
            success(function (data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                    console.log("saveWorkHours | Status not OK " + status);
                    deffered.reject("Error");
                }

            }).
            error(function (data, status) {
                console.log("saveWorkHours | Error " + status);
                deffered.reject("Error");
            });
            return deffered.promise;
        }


    }]);
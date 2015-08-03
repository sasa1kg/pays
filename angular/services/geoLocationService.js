var GeoLocationService = angular.module('GeoLocationService', [])
	.service('GeoLocationService', ['localStorageService', "$q", "$http", function (localStorageService, q, http) {



    var semaphore = false;
    var deferred = q.defer();

    this.hello = function () {
    	return "Hello from service";
    };

    this.getLocation = function () {
        if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
             return deferred.promise;
        }
          else {
            alert("Geolocation is not supported by this browser.");
            return deferred.promise;
            this.clearGeoLoc;
        }
    };

    this.showError = function (error) {
            alert (error);
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    this.clearGeoLoc;
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    this.clearGeoLoc;
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    this.clearGeoLoc;
                    break;
                case error.UNKNOWN_ERROR:
                    alert( "An unknown error occurred.");
                    this.clearGeoLoc;
                    break;
            }
    };

    this.showPosition = function (position) {
       var isGeoLocAdded = false;
            var geolocIdentifier = {
                "type" : "geoloc",
                "name" : "geoloc"
            }
            var geolocInfo = {
                "lat" : position.coords.latitude,
                "lng" : position.coords.longitude,
                "accuracy" : position.coords.accuracy
            };
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "geoloc") {
                    var geolocInfo = {
                        "lat" : position.coords.latitude,
                        "lng" : position.coords.longitude,
                        "accuracy" : position.coords.accuracy
                    };
                    localStorageService.set(keys[i], geolocInfo);
                    isGeoLocAdded = true;
                }
            }

            if (!isGeoLocAdded) {
                localStorageService.set(JSON.stringify(geolocIdentifier), geolocInfo);
            }
 
            deferred.resolve(true);
          
    };

    this.clearGeoLoc = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "geoloc") {
                     alert("clearGeoLoc");
                    localStorageService.remove(keys[i]);
                }
        }
        deferred.resolve(false);
    };

    this.getGeoLoc = function () {
        var isGeoLocAdded = false;
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "geoloc") {
                    var localItem  = localStorageService.get(keys[i]);
                    return localStorageService.get(keys[i]);
                }
        }
        return null;
    };

    this.findGeoLoc = function (place) {
            var findGeoLocDeffered = q.defer();
            console.log("find geo loc " + place);
            var res = place.split(" ");
            var url = 'http://maps.google.com/maps/api/geocode/json?address=';
            for (var i = 0; i <= res.length -1; i++) {
                url = url + "+" + res[i];
            };
            console.log("url to call " + url);
            http.get(url).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200 && data.status === "OK") {
                    console.log("Status OK");
                    findGeoLocDeffered.resolve(data.results[0].geometry.location);
                } else {
                   console.log("Status not OK");
                   findGeoLocDeffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                    console.log("Error");
                   findGeoLocDeffered.reject("Error");
              });
            return findGeoLocDeffered.promise;
    }

    this.testPromise = function () {
        var testDef = q.defer();
        var myTimeoutId = setTimeout( function(){
            testDef.resolve("hello");
        }, 2000);
        return testDef.promise;
    }
}]);
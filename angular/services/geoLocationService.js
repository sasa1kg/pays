var GeoLocationService = angular.module('GeoLocationService', [])
	.service('GeoLocationService', function () {


    this.hello = function () {
    	return "Hello from service";
    };

    this.getLocation = function () {
        if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
        }
          else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    this.showError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert( "An unknown error occurred.");
                    break;
            }
    };

    this.showPosition = function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var accuracy = position.coords.accuracy;
 
 			alert("GEO POS: " + lat + " " + lng + " " + accuracy);
          
    };

});
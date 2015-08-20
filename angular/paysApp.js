var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule', 
	'GeoLocationService', 'CartService', 'WishlistService', 'SearchService', 
	'ui-rangeSlider', 'cgBusy', 'brantwills.paging'])
    .filter('html',function($sce){
    return function(input){
        console.log("AAAA".concat(input));
        return $sce.trustAsHtml(input);
    }
});

paysApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('paysApp');
});

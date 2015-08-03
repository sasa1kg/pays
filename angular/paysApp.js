var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule', 
	'GeoLocationService', 'CartService', 'WishlistService', 'SearchService', 
	'ui-rangeSlider', 'cgBusy', 'brantwills.paging']);

paysApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('paysApp');
});

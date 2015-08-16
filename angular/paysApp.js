var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule', 
	'GeoLocationService', 'CartService', 'WishlistService', 'SearchService', 
	'ui-rangeSlider', 'cgBusy', 'brantwills.paging',"checklist-model"]);

paysApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('paysApp');
});

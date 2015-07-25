var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule', 'GeoLocationService', 'CartService', 'WishlistService']);

paysApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('paysApp');
});


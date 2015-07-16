var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule', 'GeoLocationService', 'CartService']);

paysApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('paysApp');
});


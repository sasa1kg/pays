angular.module("paysApp").config(['$routeProvider', function (routeProvider) {

    routeProvider.when("/", {
        templateUrl: "partials/mainPage.html",
        controller: "mainCtrl",
        resolve: {},
        restricted : false
    })
        .when("/cart", {
            templateUrl: "partials/cart.html",
            controller: "cartCtrl",
            resolve: {},
            restricted : false
        })
        .when("/wishlist", {
            templateUrl: "partials/wishlist.html",
            controller: "wishlistCtrl",
            resolve: {},
            restricted : false
        })
        .when("/checkout", {
            templateUrl: "partials/checkout.html",
            controller: "checkoutCtrl",
            resolve: {},
            restricted : false
        })
        .when("/farmer/:id/", {
            templateUrl: "partials/farmerPage.html",
            controller: "farmCtrl",
            resolve: {},
            restricted : false
        })
        .when("/distributor/:id/", {
            templateUrl: "partials/distributorPage.html",
            controller: "distributorCtrl",
            resolve: {},
            restricted : false
        })
        .when("/distributoredit/:id/", {
            templateUrl: "partials/editDistributor.html",
            controller: "editDistributorCtrl",
            resolve: {},
            restricted : false,
            allow: 'T'
        })
        .when("/farmeredit/:id/", {
            templateUrl: "partials/editFarmer.html",
            controller: "editFarmerCtrl",
            resolve: {},
            restricted : false,
            allow: 'F'
        })
        .when("/404", {
            templateUrl: "404.html",
            resolve: {},
            restricted : false
        })
        .when("/login", {
            templateUrl: "partials/login.html",
            controller: "loginCtrl",
            resolve: {},
            restricted : false
        })
        .when("/register", {
            templateUrl: "partials/register.html",
            controller: "registerCtrl",
            resolve: {},
            restricted : false
        })
        .when("/distributorSearch", {
            templateUrl: "partials/distributorSearch.html",
            controller: "distributorSearchCtrl",
            resolve: {},
            restricted : false
        }).when("/redirection/token/:token/id/:id/role/:role", {
            templateUrl: "partials/redirect.html",
            controller: "redirectCtrl",
            resolve: {},
            restricted : false
        }).when("/forgotpass/:token", {
          templateUrl: "partials/forgotPassword.html",
          controller: "forgotPasswordCtrl",
          resolve: {},
          restricted : false
      }).otherwise({redirectTo: '/'});
}]);
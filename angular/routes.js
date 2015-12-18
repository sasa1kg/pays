angular.module("paysApp").config(['$routeProvider', function (routeProvider) {

    routeProvider.when("/", {
        templateUrl: "partials/mainPage.html",
        controller: "mainCtrl",
        resolve: {}
    })
        .when("/cart", {
            templateUrl: "partials/cart.html",
            controller: "cartCtrl",
            resolve: {}
        })
        .when("/wishlist", {
            templateUrl: "partials/wishlist.html",
            controller: "wishlistCtrl",
            resolve: {}
        })
        .when("/checkout", {
            templateUrl: "partials/checkout.html",
            controller: "checkoutCtrl",
            resolve: {}
        })
        .when("/farmer/:id/", {
            templateUrl: "partials/farmerPage.html",
            controller: "farmCtrl",
            resolve: {}
        })
        .when("/distributor/:id/", {
            templateUrl: "partials/distributorPage.html",
            controller: "distributorCtrl",
            resolve: {}
        })
        .when("/distributoredit/:id/", {
            templateUrl: "partials/editDistributor.html",
            controller: "editDistributorCtrl",
            resolve: {}
        })
        .when("/farmeredit/:id/", {
            templateUrl: "partials/editFarmer.html",
            controller: "editFarmerCtrl",
            resolve: {}
        })
        .when("/404", {
            templateUrl: "404.html",
            resolve: {}
        })
        .when("/login", {
            templateUrl: "partials/login.html",
            controller: "loginCtrl",
            resolve: {}
        })
        .when("/register", {
            templateUrl: "partials/register.html",
            controller: "registerCtrl",
            resolve: {}
        })
        .when("/distributorSearch", {
            templateUrl: "partials/distributorSearch.html",
            controller: "distributorSearchCtrl",
            resolve: {}
        }).when("/redirection/token/:token/id/:id/role/:role", {
            templateUrl: "partials/redirect.html",
            controller: "redirectCtrl",
            resolve: {}
        }).otherwise({redirectTo: '/'});
}]);
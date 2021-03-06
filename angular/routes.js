angular.module("paysApp").config(['$routeProvider', function (routeProvider) {

  routeProvider.when("/", {
    templateUrl: "partials/mainPage.html",
    controller: "mainCtrl",
    resolve: {},
    restricted: false
  })
    .when("/cart", {
      templateUrl: "partials/cart.html",
      controller: "cartCtrl",
      resolve: {},
      restricted: false
    })
    .when("/wishlist", {
      templateUrl: "partials/wishlist.html",
      controller: "wishlistCtrl",
      resolve: {},
      restricted: false
    })
    .when("/checkout", {
      templateUrl: "partials/checkout.html",
      controller: "checkoutCtrl",
      resolve: {},
      restricted: false
    })
    .when("/farmer/:id/", {
      templateUrl: "partials/farmerPage.html",
      controller: "farmCtrl",
      resolve: {},
      restricted: false
    })
    .when("/distributor/:id/", {
      templateUrl: "partials/distributorPage.html",
      controller: "distributorCtrl",
      resolve: {},
      restricted: false
    })
    .when("/distributoredit/:id/", {
      templateUrl: "partials/editDistributor.html",
      controller: "editDistributorCtrl",
      resolve: {},
      restricted: true,
      allow: 'T'
    })
    .when("/farmeredit/:id/", {
      templateUrl: "partials/editFarmer.html",
      controller: "editFarmerCtrl",
      resolve: {},
      restricted: true,
      allow: 'F'
    })
    .when("/buyeredit/:id/", {
      templateUrl: "partials/editBuyer.html",
      controller: "editBuyerCtrl",
      resolve: {},
      restricted: true,
      allow: 'C'
    })
    .when("/404", {
      templateUrl: "404.html",
      resolve: {},
      restricted: false
    })
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "loginCtrl",
      resolve: {},
      restricted: false
    })
    .when("/register", {
      templateUrl: "partials/register.html",
      controller: "registerCtrl",
      resolve: {},
      restricted: false
    })
    .when("/distributorSearch", {
      templateUrl: "partials/distributorSearch.html",
      controller: "distributorSearchCtrl",
      resolve: {},
      restricted: false
    }).when("/redirection/token/:token/id/:id/role/:role", {
      templateUrl: "partials/redirect.html",
      controller: "redirectCtrl",
      resolve: {},
      restricted: false
    }).when("/forgotpass/:token", {
      templateUrl: "partials/forgotPassword.html",
      controller: "forgotPasswordCtrl",
      resolve: {},
      restricted: false
    }).when("/activateuser/:token", {
      templateUrl: "partials/activateUser.html",
      controller: "activateUserCtrl",
      restricted: false
    }).when("/order/:orderId", {
      templateUrl: "partials/order.html",
      controller: "orderCtrl",
      restricted: false
    }).when("/info", {
      templateUrl: "partials/infoPage.html",
      controller: "",
      restricted: false
    }).otherwise({redirectTo: '/'});
}]);
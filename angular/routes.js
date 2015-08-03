angular.module("paysApp").config(['$routeProvider', function(routeProvider) {

	routeProvider.when("/", {
		templateUrl: "partials/mainPage.html",
		controller: "mainCtrl",
		resolve: {
		}
	})
	.when("/cart", {
		templateUrl: "partials/cart.html",
		controller: "cartCtrl",
		resolve: {
		}
	})
	.when("/wishlist", {
		templateUrl: "partials/wishlist.html",
		controller: "wishlistCtrl",
		resolve: {
		}
	})
	.when("/blogSingle", {
		templateUrl: "partials/blog-single.html",
		controller: "blogSingleCtrl",
		resolve: {
		}
	})
	.when("/blog", {
		templateUrl: "partials/blog.html",
		controller: "blogCtrl",
		resolve: {
		}
	})
	.when("/checkout", {
		templateUrl: "partials/checkout.html",
		controller: "checkoutCtrl",
		resolve: {
		}
	})
	.when("/farmer/:id/", {
		templateUrl: "partials/farmerPage.html",
		controller: "farmCtrl",
		resolve: {
		}
	})
	.when("/farmer/:id/product/:productid", {
		templateUrl: "partials/product-details.html",
		controller: "productDetailsCtrl",
		resolve: {
		}
	})
	.when("/404", {
		templateUrl: "404.html",
		resolve: {
		}
	})
	.when("/login", {
		templateUrl: "partials/login.html",
		controller: "loginCtrl",
		resolve: {
		}
	})
	.when("/search", {
		templateUrl: "partials/search.html",
		controller: "searchCtrl",
		resolve: {
		}
	})
	.otherwise({redirectTo: '/'});
}]);
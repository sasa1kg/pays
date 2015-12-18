angular.module('paysApp').controller("productDetailsCtrl", ["$scope", "$http", "$filter", "$routeParams",
    "CartService", "WishlistService",
    function (scope, http, filter, routeParams, CartService, WishlistService) {

        console.log("productDetailsCtrl!");
        scope.msg = "productDetailsCtrl!";

        scope.farmerId = routeParams.id;
        scope.productId = routeParams.productid;
        scope.ammount = 1;

        scope.addToWishlist = function () {

            WishlistService.putInWishlist(scope.product.id,
                scope.product.name,
                scope.product.measure,
                scope.product.price,
                scope.product.image,
                scope.farmer.id,
                scope.farmer.name,
                scope.farmer.location
            );
            scope.wishlistItems = WishlistService.getItemsSize();
        }


        scope.farmer = {
            "name": "Farmer  jedan",
            "location": "Novi Sad",
            "img": "images/home/product1.jpg",
            "items": 10,
            "reviews": "",
            "id": scope.farmerId
        };

        scope.product = {
            "id": 10,
            "name": "Paradajz",
            "category": "Povrce",
            "price": 215,
            "measure": "kg",
            "currency": "RSD",
            "image": "images/cart/tomato.png"
        };

        scope.otherProducts = [
            {
                "id": 17,
                "name": "Krastavac",
                "category": "Povrce",
                "price": 55,
                "measure": "kg",
                "currency": "RSD",
                "image": "images/cart/cucumber.png"
            },
            {
                "id": 18,
                "name": "Mladi luk",
                "category": "Povrce",
                "price": 55,
                "measure": "veza",
                "currency": "RSD",
                "image": "images/cart/onion.gif"
            },
            {
                "id": 21,
                "name": "Krastavac II klasa",
                "category": "Povrce",
                "price": 45,
                "measure": "kg",
                "currency": "RSD",
                "image": "images/cart/cucumber.png"
            }
        ];

        scope.addToCart = function () {
            if (CartService.canBeAdded(scope.farmerId)) {

                CartService.putInCartAmmount(scope.product.id,
                    scope.product.name,
                    scope.product.measure,
                    scope.product.price,
                    scope.product.image,
                    scope.farmerId,
                    "Ime farmera",
                    "Lokacija",
                    scope.ammount);

                scope.cartItems = CartService.getItemsSize();
                scope.wishlistItems = WishlistService.getItemsSize();
            } else {
                alert("Proizvodi drugog farmera su u kolicima.");
            }
        }
    }]);
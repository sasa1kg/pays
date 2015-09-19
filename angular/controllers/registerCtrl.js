angular.module('paysApp').controller("registerCtrl", ["$scope", "$http", "$filter", "CartService", "WishlistService",
    function (scope, http, filter, CartService, WishlistService) {

        console.log("RegisterCtrl");

        scope.userType = "";

        scope.buyer = {
            email: "",
            password: "",
            confPassword: "",
            username: "",
            nameSurname: "",
            streetAndNr: "",
            postalCode: "",
            city: "",
            phone: ""
        };
        scope.distributor = {
            email: "",
            password: "",
            confPassword: "",
            username: "",
            companyName: "",
            streetAndNr: "",
            postalCode: "",
            city: "",
            phone: ""
        };
        scope.farmer = {
            email: "",
            password: "",
            confPassword: "",
            username: "",
            farmName: "",
            streetAndNr: "",
            postalCode: "",
            city: "",
            phone: ""
        };
        scope.userTypes = [
            {
                name: "BUYER",
                id: 1
            },
            {
                name: "DISTRIBUTOR",
                id: 2
            },
            {
                name: "FARMER",
                id: 3
            }

        ]
        scope.cartItems = CartService.getItemsSize();
        scope.wishlistItems = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";

        scope.register = function () {
            if (scope.userType == 1) {
                console.log("Register buyer!");
                console.log(scope.buyer);
            } else if (scope.userType == 2) {
                console.log("Register distributor");
                console.log(scope.distributor);
            }
            if (scope.userType == 3) {
                console.log("Register farmer");
                console.log(scope.farmer);
            }
        }

        scope.copyEmail = function(){
            if (scope.userType == 1) {
                scope.buyer.username = scope.buyer.email;
                console.log("aaaaa");
            } else if (scope.userType == 2) {
                scope.distributor.username = scope.distributor.email;
                console.log("bbbbb");

            }
            if (scope.userType == 3) {
                scope.farmer.username = scope.farmer.email;
                console.log("ccccc");

            }

        }
    }]);
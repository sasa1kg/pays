angular.module('paysApp').controller("registerCtrl", ["$scope", "$http","$rootScope", "$filter", "CartService", "WishlistService",
    function (scope, http, routeParams, filter, CartService, WishlistService) {

        console.log("RegisterCtrl");

        var userType = "";

        console.log("Register user type "+ scope.userType);

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
            companyName: "",
            streetAndNr: "",
            postalCode: "",
            city: "",
            phone: "",
            accountNumber: "",
            pibNumber: "",
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



        scope.register = function () {
            if (scope.userType == $rootScope.buyerUserType) {
                console.log("Register buyer!");
                console.log(scope.buyer);
            } else if (scope.userType == $rootScope.distributorUserType) {
                console.log("Register distributor");
                console.log(scope.distributor);
            }
            if (scope.userType == $rootScope.farmerUserType) {
                console.log("Register farmer");
                console.log(scope.farmer);
            }
        }

        scope.copyEmail = function(){
            if (scope.userType == $rootScope.buyerUserType) {
                scope.buyer.username = scope.buyer.email;
            } else if (scope.userType == $rootScope.distributorUserType) {
                scope.distributor.username = scope.distributor.email;

            }
            if (scope.userType == $rootScope.farmerUserType) {
                scope.farmer.username = scope.farmer.email;

            }

        }
        scope.wishlistItemsSize = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";
    }]);
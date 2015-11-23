angular.module('paysApp').controller("registerCtrl", ["$scope", "$http","$rootScope", "$filter","UserService","WishlistService","CartService","Notification",
    function (scope, http, rootScope, filter, UserService,WishlistService,CartService,Notification) {

        scope.userType = "";

        scope.confPassword = "";

        scope.userTypes = [
            {
                name: "BUYER",
                id: rootScope.buyerUserType
            },
            {
                name: "DISTRIBUTOR",
                id: rootScope.distributorUserType
            },
            {
                name: "FARMER",
                id: rootScope.farmerUserType
            }

        ]

        scope.buyer = {
            "type": "C",
            "username": "",
            "password": "",
            "email": "",
            "isPrivateUser": true,
            "private": {
                "name": "",
                "lastName": "",
                "address": "",
                "phone": ""
            }
        };

        scope.distributor = {
            type: "T",
            username: "",
            password: "",
            email: "",
            isPrivateUser: false,
            company: {
                name: "",
                account: "",
                taxNum: "",
                companyNum: "",
                businessActivityCode: "",
                address: "",
                phoneNum: "",
                fax: ""
            }
        };

        scope.farmer = {
            type: "F",
            username: "",
            password: "",
            email: "",
            isPrivateUser: false,
            company: {
                name: "",
                account: "",
                taxNum: "",
                companyNum: "",
                businessActivityCode: "",
                address: "",
                phoneNum: "",
                fax: ""
            }
        };



        scope.register = function () {
            if (scope.userType == rootScope.buyerUserType) {
                console.log(scope.buyer);
                if ((scope.buyer.password.length == 0) || (scope.confPassword.length == 0) || (scope.buyer.password !== scope.confPassword))
                {
                    Notification.error({message: "Passwords do not match"});
                } else {
                    UserService.registerUser(scope.buyer).then(function (data) {
                    }).catch(function(error){
                        Notification.error({message: "Unable to add user"});
                    });
                }
            } else if (scope.userType == rootScope.distributorUserType) {
                console.log(scope.distributor);
                if ((scope.distributor.password.length == 0) || (scope.confPassword.length == 0) || (scope.distributor.password !== scope.confPassword))
                {
                    Notification.error({message: "Passwords do not match"});
                } else {
                    UserService.registerUser(scope.distributor).then(function (data) {
                    }).catch(function(error){
                        Notification.error({message: "Unable to add user"});
                    });
                }
            }
            else if (scope.userType == rootScope.farmerUserType) {
                console.log(scope.farmer);
                if ((scope.farmer.password.length == 0) || (scope.confPassword.length == 0) || (scope.farmer.password !== scope.confPassword))
                {
                    Notification.error({message: "Passwords do not match"});
                } else {
                    UserService.registerUser(scope.farmer).then(function (data) {
                    }).catch(function(error){
                        Notification.error({message: "Unable to add user"});
                    });
                }
            }
        }

        scope.copyEmail = function(){
            if (scope.userType == rootScope.buyerUserType) {
                scope.buyer.username = scope.buyer.email;
            } else if (scope.userType == rootScope.distributorUserType) {
                scope.distributor.username = scope.distributor.email;
            }
            if (scope.userType == rootScope.farmerUserType) {
                scope.farmer.username = scope.farmer.email;

            }
        }

        scope.validatePassword = function(conf) {
            scope.confPassword = conf;
            if (conf.length > 0) {
                if (scope.userType == rootScope.buyerUserType) {
                    if ((scope.buyer.password.length > 0)  && (scope.buyer.password === scope.confPassword))
                    {
                        Notification.success({message: "OK"});
                    }
                } else if (scope.userType == rootScope.distributorUserType) {
                    if ((scope.distributor.password.length > 0)  && (scope.distributor.password === scope.confPassword)){
                        Notification.success({message: "OK"});
                    }
                } else if (scope.userType == rootScope.farmerUserType) {
                    if ((scope.farmer.password.length > 0)  && (scope.farmer.password === scope.confPassword)) {
                        Notification.success({message: "OK"});
                    }
                }
            }
        }
        scope.wishlistItemsSize = WishlistService.getItemsSize();
        scope.price = CartService.getTotalCartAmount() + "";
    }]);
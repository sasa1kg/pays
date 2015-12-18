/**
 * Created by nignjatov on 18.12.2015.
 */
angular.module('paysApp').controller("navbarCtrl", ["$scope","$rootScope","$location",
    "CartService", "WishlistService", "UserService",
    function (scope, rootScope,location, CartService, WishlistService, UserService) {


        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

        scope.logout = function(){
            UserService.logoutUser();
        }

        scope.isLoggedIn = function(){
            rootScope.credentials = UserService.getUserCredentials();
            if(rootScope.credentials.token != null){
                return true;
            }
            return false;
        }

        scope.goToProfile = function(){
            rootScope.credentials = UserService.getUserCredentials();
            if(rootScope.credentials.token != null){
                if(rootScope.credentials.role == rootScope.farmerUserType){
                    location.path("/farmeredit/"+rootScope.credentials.id);
                } else if(rootScope.credentials.role == rootScope.distributorUserType){
                    location.path('/distributoredit/'+rootScope.credentials.id);
                }
            }
        }

    }]);

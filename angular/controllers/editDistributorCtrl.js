/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService",
    function (scope, http, filter, routeParams, CartService, WishlistService, SearchService) {

        console.log("edit Distributor:  " + routeParams.id);

        scope.page = 'GENERAL_DISTRIBUTOR_DATA';

        scope.distributorUser = {
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

        scope.distributor = SearchService.getDistributorById(routeParams.id);

        scope.distributorVehicles = SearchService.getVehiclesByDistributorId(routeParams.id);

        scope.price = CartService.getTotalCartAmount()+"";

        scope.sectionChange = function(sectionName){
            scope.page = sectionName;
        }

        scope.saveChanges = function(){
            console.log("Saving changes!");
        }

    }]);
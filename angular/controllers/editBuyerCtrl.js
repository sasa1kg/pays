/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editBuyerCtrl", ["$scope", "$rootScope", "$http", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService", "UserService", "Notification",
  function (scope, rootScope, http, filter, routeParams, CartService, WishlistService, SearchService, UserService, Notification) {

    console.log("edit buyer:  " + routeParams.id);

    scope.page = 'GENERAL_BUYER_DATA';

    scope.orders = [];
    SearchService.getClientById(routeParams.id).then(function (data) {
      scope.buyer = data;
    });

    var defaultRating = 5;
    SearchService.getBuyerOrders(routeParams.id).then(function (data) {
      scope.orders  = [];
      var farmerIds = [];
      angular.forEach(data,function(order){
        if (order.status != 'C') {
          scope.orders.push(order);
        }
      });
      for (var i = 0; i < scope.orders.length; i++) {
          scope.orders[i].showDetails = false;
          scope.orders[i].showReview  = false;
          scope.orders[i].review      = {
            stars: [],
            comment: "",
            rating: defaultRating,
          };
          for (var j = 1; j <= defaultRating; j++) {
            scope.orders[i].review.stars.push({index: j, filled: true});
          }

          if (farmerIds.indexOf(scope.orders[i].orderedFrom) == -1) {
            farmerIds.push(scope.orders[i].orderedFrom);
          }
      }
      for (var i = 0; i < farmerIds.length; i++) {
        SearchService.getFarmerById(farmerIds[i]).then(function (farmer) {
          for (var j = 0; j < scope.orders.length; j++) {
            if (scope.orders[j].orderedFrom == farmer.id) {
              scope.orders[j].farmer = farmer;
            }
          }
        });
      }
    });

    scope.sectionChange = function (sectionName) {
      scope.page = sectionName;
    }


    scope.toggle = function (order, star) {
      for (var i = 0; i < 5; i++) {
        order.review.stars[i].filled = false;
      }
      order.review.rating = star.index;

      for (var i = 0; i < order.review.rating; i++) {
        order.review.stars[i].filled = true;
      }
    };

    scope.submitReview           = function (order) {
      console.log(order.review);
      UserService.postOrderReview(routeParams.id, order.id, {
        comment: order.review.comment,
        rating: order.review.rating
      }).then(function (data) {
        Notification.success({message: filter('translate')('REVIEW_SUBMITED')});
        order.review.comment = "";
        order.hasComments = true;
      }).catch(function () {
        Notification.error({message: filter('translate')('REVIEW_NOT_SUBMITED')});
      });
    }
    scope.saveGeneralInfoChanges = function () {
      UserService.updateBuyerGeneralInfo(scope.buyer.id,
        {
          privateSubject: scope.buyer.privateSubject
        }
      ).then(function (data) {
          console.log(data);
          Notification.success({message: filter('translate')('GENERAL_INFO_UPDATED')});
        }).catch(function (err) {
          console.error(err);
          Notification.error({message: filter('translate')('GENERAL_INFO_NOT_UPDATED')});
        })
    }
  }])
;


angular.module('paysApp').controller("activateUserCtrl", ["$scope", "$http", "$filter","$modal", "$routeParams","$window",
  "UserService", "Notification",
  function (scope, http, filter,modal, routeParams,$window, UserService, Notification) {

    console.log("activateUserCtrl");
    var token = routeParams.token;
    console.log(token);

    scope.success=false;
    scope.message = '';
    UserService.activateUser(token).then(function(){
      scope.success=true;
      scope.message = 'ACTIVATED_USER_MSG';
    }).catch( function(err){
      scope.message = 'NOT_ACTIVATED_USER_MSG';
    });

    scope.goToLogin = function () {
      $window.location.href = "#/login";
    }
  }]);
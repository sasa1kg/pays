angular.module('paysApp').controller("forgotPasswordCtrl", ["$scope", "$http", "$filter","$modal", "$routeParams", "UserService", "Notification",
  function (scope, http, filter,modal, routeParams, UserService, Notification) {

    console.log("forgotPasswordCtrl");
    var token = routeParams.token;
    console.log(token);

    scope.password        = "";
    scope.confirmPassword = "";

    scope.passwordsSame = function () {
      if (scope.password.length == 0) {
        return false;
      }

      if (scope.password != scope.confirmPassword) {
        return false;
      }
      return true;
    }
    scope.resetPassword = function () {
      UserService.resetPassword({
        passwordChangeToken: token,
        newPass: scope.password
      }).then(function (data) {
        var modalInstance = modal.open({
          animation: true,
          templateUrl: 'passChangedModalCtrl.html',
          controller: 'passChangedModalCtrl',
          size: 'sm'
        });
      }).catch(function (err) {
        Notification.error({message: filter('translate')('PASSWORD_NOT_CHANGED')});
      });
    }
  }]);


angular.module('paysApp').controller('passChangedModalCtrl', function ($scope, $modalInstance, $location) {

  $scope.goToLogin = function () {
    $modalInstance.close();
    $location.path('/login');
  }

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };
});
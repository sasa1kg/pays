angular.module('paysApp').controller("loginCtrl", ["$scope", "$http", "$filter", "$window", "CartService", "WishlistService", "UserService", "Notification",
  function (scope, http, filter, $window, CartService, WishlistService, UserService, Notification) {

    console.log("login Ctrl!");

    scope.login = function () {
      var clientId = "41a888d71e754ee99167eaebecace9c1";
      var domain   = "pays-system.com";

      //redirect url for the user to authenticate
      //itself using the fi-ware oauth
      var newURL            = "http://148.6.81.216/oauth2/authorize"
        + "?response_type=code"
        + "&client_id=" + clientId
        + "&state=xyz"
        + "&redirect_uri=http%3A%2F%2F" + domain
        + "%2Fcallback.php";

      //actual redirect
      console.log(newURL);
      $window.location.href = newURL;
    }

    scope.forgotPassEmail = "";

    scope.forgotPass = function () {
      console.log("FORGOT" + scope.forgotPassEmail);
      UserService.sendForgotPasswordEmail({
        email: scope.forgotPassEmail
      }).then(function (data) {
        Notification.success({message: filter('translate')('PASSWORD_EMAIL_SENT')});
      }).catch(function (err) {
        Notification.error({message: filter('translate')('PASSWORD_EMAIL_NOT_SENT')});
      });
    }
  }]);
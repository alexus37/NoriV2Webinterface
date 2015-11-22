'use strict';
var module = angular.module('myApp.login');
module.config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginController'
        });
        growlProvider.globalTimeToLive(3000);
    }]);
module.controller('LoginController', ['$scope', 'growl', '$location', 'AuthenticationService',
        function ($scope, growl,  $location, AuthenticationService) {
            // reset login status
            $scope.login = function () {
                AuthenticationService.ClearCredentials();
                AuthenticationService.SetCredentials($scope.username, $scope.password);
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    if ("user" in response) {
                        $scope.noLogin = true;
                        $location.path('/view1');
                        growl.success("Welcome back :" + response["user"], {});
                    } else {
                        AuthenticationService.ClearCredentials();
                        growl.error(response.detail, {});
                        $scope.noLogin = false;
                        $scope.dataLoading = false;
                    }
                });
            };
        }]);

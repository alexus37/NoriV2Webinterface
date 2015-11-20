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
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    if (response.success) {
                        AuthenticationService.SetCredentials($scope.username, $scope.cookie);
                        $scope.noLogin = true;
                        $location.path('/view1');
                    } else {
                        console.log(response.message);
                        $scope.noLogin = false;
                        $scope.dataLoading = false;
                    }
                });
            };
        }]);

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
                        $scope.$parent.noLogin = true;

                        growl.success("Welcome back :" + response["user"], {});
                        $scope.$parent.username = response["user"];
                        $location.path('/view1');
                    } else {
                        AuthenticationService.ClearCredentials();
                        growl.error(response.detail, {});
                        $scope.$parent.noLogin = false;;
                        $scope.$parent.username = "";
                        $scope.dataLoading = false;
                    }
                });
            };
        }]);

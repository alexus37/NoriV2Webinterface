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

                        growl.success("Welcome back :" + response["user"]["username"], {});
                        $scope.$parent.user = response["user"];
                        $location.path('/editor');
                        $scope.$parent.viewModel = 'editor';
                    } else {
                        AuthenticationService.ClearCredentials();
                        growl.error(response.detail, {});
                        $scope.$parent.user = null;
                        $scope.dataLoading = false;
                    }
                });
            };
        }]);

'use strict';
var module = angular.module('myApp.login');
module.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope',
        function ($http, $cookieStore, $rootScope) {
            var service = {};

            service.Login = function (username, password, callback) {
                $http.post('/authenticate', { username: username, password: password })
                    .success(function (response) {
                        callback(response);
                    });

            };

            service.SetCredentials = function (username, authdata) {

                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        cookie: authdata
                    }
                };

                $http.defaults.headers.common['Cookie'] = authdata;
                $cookieStore.put('csrftoken', $rootScope.globals);
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('csrftoken');
                $http.defaults.headers.common.Authorization = '';
            };

            return service;
        }]);



'use strict';

// Declare app level module which depends on views, and components
/**
 * @ngdoc overview
 * @name myApp
 * @requires ngRoute
 * @requires myApp.view1
 * @requires myApp.view2
 * @requires myApp.view3
 * @author Alexander Lelidis
 * @description
 * Main module of the whole application.
 */
angular.module('myApp', [
  'ngRoute',
  'myApp.view1'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
/**
 * @ngdoc controller
 * @name myApp.controller:MainCtrl
 * @requires $scope
 * @requires $http
 * @requires $location
 * @requires $window
 * @author Alexander Lelidis
 * @description
 * The main controller activates the sub controller depending on the requested url.
 */
.controller('MainCtrl', ["$scope", "$http", "$location", "$window", function($scope, $http, $location, $window) {
	$scope.viewModel = 'view1';
    $scope.server = "http://"+location.host;

    $scope.$watch('viewModel', function(value) {
    	$window.open('#/' + value, '_self');
    });


}]);
/**
 * @ngdoc overview
 * @name myApp.view1
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @requires ui.codemirror
 * @description
 * Main view, does most of the computation, handles the charts and interaction with the leaflet map.
 */
angular.module('myApp.view1', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'angular-growl', 'ui.codemirror']);

'use strict';

// Declare app level module which depends on views, and components
/**
 * @ngdoc overview
 * @name myApp
 * @requires ngRoute
 * @requires myApp.view1
 * @requires myApp.upload
 * @requires myApp.view3
 * @author Alexander Lelidis
 * @description
 * Main module of the whole application.
 */
angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.basic',
  'myApp.basicWebSocket',
  'myApp.basicWebSocketPatches',
  'myApp.upload'
])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/login'});
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
.controller('MainCtrl', ["$scope", "$http", "$location", "$window", "AuthenticationService",
    function($scope, $http, $location, $window, AuthenticationService) {
    	$scope.viewModel = 'login';
      $scope.server = "http://"+location.host;
      $scope.serverhost = location.host;
      $scope.noLogin = true;
      $scope.user = null;

      $scope.logout = function () {
        AuthenticationService.ClearCredentials();
        $scope.changeViewModel('login');
      }

      $scope.changeViewModel = function(value) {
        $window.open('#/' + value, '_self');
      }

      $scope.logout();


}]);

/**
 * @ngdoc overview
 * @name myApp.login
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @description
 * Main view, does most of the computation, handles the charts and interaction with the leaflet map.
 */
angular.module('myApp.login', ['ngRoute', 'ngCookies', 'angular-growl']);



/**
 * @ngdoc overview
 * @name myApp.basic
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @requires ui.codemirror
 * @description
 * Main view, does most of the computation, handles the charts and interaction with the leaflet map.
 */
angular.module('myApp.basic', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'angular-growl', 'ui.codemirror']);
/**
 * @ngdoc overview
 * @name myApp.upload
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @description
 * Main view, does most of the computation, handles the charts and interaction with the leaflet map.
 */
angular.module('myApp.upload', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'angular-growl', 'angularFileUpload', 'tjsModelViewer']);

/**
 * @ngdoc overview
 * @name myApp.basic
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @requires ui.codemirror
 * @description
 * Main view, does most of the computation, handles the charts and interaction with the leaflet map.
 */
angular.module('myApp.basicWebSocket', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'angular-growl', 'ui.codemirror', 'ngWebSocket', 'SwampDragonServices']);


/**
 * @ngdoc overview
 * @name myApp.basic
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @requires ui.codemirror
 * @description
 * Main view, does most of the computation, handles the charts and interaction with the leaflet map.
 */
angular.module('myApp.basicWebSocketPatches', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'angular-growl', 'ui.codemirror', 'ngWebSocket', 'SwampDragonServices']);

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
  'myApp.basicWebSocketPatches',
  'myApp.upload',
  'myApp.editor'
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
      $scope.curViewAnimation = 'fade';
      $scope.server = "http://"+location.host;
      $scope.serverhost = location.host;

      $scope.user = null;
      var animation = {
        login2login: 'fade',  // first login
        login2editor: 'fade',
        editor2logout: 'fade',
        editor2upload: 'slideup',
        upload2editor: 'slidedown',
        editor2basicWebSocketPatches: 'slideleft',
        basicWebSocketPatches2editor: 'slideright',
      };

      $scope.logout = function () {
        AuthenticationService.ClearCredentials();
        $scope.changeViewModel('login');
      }

      $scope.changeViewModel = function(value) {
        var viewName = value;
        if(value == 'logout') {
          AuthenticationService.ClearCredentials();
          viewName = 'login'
        }
        $scope.curViewAnimation = animation[$scope.viewModel + '2' + value];
        
        $scope.viewModel = viewName;
        $window.open('#/' + viewName, '_self');
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
 * @name myApp.upload
 * @author Alexander Lelidis
 * @requires ngRoute
 * @requires ui.bootstrap
 * @requires angular-loading-bar
 * @requires angular-growl
 * @requires tjsModelViewer
 * @description
 * Obj uploader and viewer
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
 * @description
 * 
 */
angular.module('myApp.editor', ['ngRoute', 'ui.bootstrap','ngAnimate', 'angular-loading-bar', 'angular-growl', 'tjsEditor', 'ngWebSocket', 'SwampDragonServices']);


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


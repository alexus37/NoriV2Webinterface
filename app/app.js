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
      $scope.xmlInput = "";//<scene>\n\t<sampler type=\"independent\">\n\t\t<integer name=\"sampleCount\" value=\"2\"/>\n\t</sampler>\n\t<integrator type=\"av\">\n\t\t<float name=\"length\" value=\"10\"/>\n\t</integrator>\n\t<camera type=\"perspective\">\n\t\t<transform name=\"toWorld\">\n\t\t\t<lookat target=\"-64.8161, 47.2211, 23.8576\" origin=\"-65.6055, 47.5762, 24.3583\" up=\"0.299858, 0.934836, -0.190177\"/>\n\t\t</transform>\n\t\t<float name=\"fov\" value=\"30\"/>\n\t\t<integer name=\"width\" value=\"768\"/>\n\t\t<integer name=\"height\" value=\"768\"/>\n\t</camera>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"ajax.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t</mesh>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"plane.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t\t<transform name=\"toWorld\">\n\t\t\t<scale value=\"100,1,100\"/>\n\t\t</transform>\n\t</mesh>\n</scene>\n";
      $scope.fileName = "Scene1.xml";

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
angular.module('myApp.editor', ['ngRoute', 'ui.bootstrap','ngAnimate', 'angular-loading-bar', 'angular-growl', 'tjsEditor', 'ngWebSocket', 'SwampDragonServices', 'ngDialog']);


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


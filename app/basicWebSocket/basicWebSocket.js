'use strict';
angular.module('myApp.basicWebSocket')
//configure the $routeProvider, that if the /basic url is called that View1Ctrl is the current controller
.config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
    $routeProvider.when('/basicWebSocket', {
        templateUrl: 'basicWebSocket/basicWebSocket.html',
        controller: 'basicWebSocket1Ctrl'
    }).otherwise({redirectTo: '/login'});
    growlProvider.globalTimeToLive(3000);
}])
.directive('mySrc', function() {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
        var img, loadImage;
        img = null;

        loadImage = function(src) {
          img = new Image();
          img.src = attrs.mySrc;
          element[0].src = src;

          img.onload = function() {
            element[0].src = attrs.mySrc;
          };
        };

        scope.$watch((function() {
          return attrs.mySrc;
        }), function(newVal, oldVal) {
          if (oldVal !== newVal) {
            loadImage(oldVal);
          }
        });
        }
    };
})

/**
 * @ngdoc controller
 * @name myApp.basic.controller:View1Ctrl

 * @requires $scope
 * @requires growl

 * @author Alexander Lelidis
 * @description
 * This controller does most of the computation.
 */
 .controller('basicWebSocket1Ctrl', ["$scope", "growl", "communicationService", "$dragon",
     function ($scope, growl, communicationService, $dragon) {
       $scope.xmlInput = "<scene>\n\t<sampler type=\"independent\">\n\t\t<integer name=\"sampleCount\" value=\"2\"/>\n\t</sampler>\n\t<integrator type=\"av\">\n\t\t<float name=\"length\" value=\"10\"/>\n\t</integrator>\n\t<camera type=\"perspective\">\n\t\t<transform name=\"toWorld\">\n\t\t\t<lookat target=\"-64.8161, 47.2211, 23.8576\" origin=\"-65.6055, 47.5762, 24.3583\" up=\"0.299858, 0.934836, -0.190177\"/>\n\t\t</transform>\n\t\t<float name=\"fov\" value=\"30\"/>\n\t\t<integer name=\"width\" value=\"768\"/>\n\t\t<integer name=\"height\" value=\"768\"/>\n\t</camera>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"ajax.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t</mesh>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"plane.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t\t<transform name=\"toWorld\">\n\t\t\t<scale value=\"100,1,100\"/>\n\t\t</transform>\n\t</mesh>\n</scene>\n";
       $scope.fileName = "sphere_side_mis.xml";
       $scope.imageData = "images/testImage.png";
       $scope.editorOptions = {
         lineWrapping : true,
         lineNumbers: true,
         theme:'twilight',
         mode: 'xml'
       };
       $scope.channel = 'update-msg';
       $scope.percentage = 0;
       $scope.sendDisabled = true;
       $scope.lastUpdate = Date.now();
       $scope.minWait = 500;
       $scope.rendering = false;


       $dragon.onReady(function() {
         // enable button
         $scope.sendDisabled = false;
       });

       $dragon.onChannelMessage(function(channels, message) {
         if (indexOf.call(channels, $scope.channel) > -1) {
           $scope.$apply(function() {

             $scope.percentage = message.data['percentage'];
             if(Date.now() > $scope.lastUpdate+$scope.minWait || message.data['finished'] == true) {
               $scope.imageData = message.data['url'] + '?cacheBuster=' + Math.random();
               $scope.lastUpdate = Date.now();
             }
             if(message.data['finished'] == true) {
               $dragon.unsubscribe('update-msg', $scope.channel, {}).then(function(response) {
               });
               growl.success("Image successfully rendered!", {});
               $scope.rendering = false;
             }
           });
         }
       });



       // set up a communication service
       var comServ = new communicationService('../render/');

       $scope.sendRequest = function(){

         var xmlQuery = {
           fileName: $scope.fileName,
           xmlData: $scope.xmlInput,
           sendMail: false,
           email: $scope.$parent.user.email
         };
         $scope.rendering = true;

         var promise = comServ.httpPostRequest(xmlQuery);
         promise.success(function updateLines(payload){
           if(payload['finished'] == false) { // started running
             $scope.channel = payload['channelname']

             $dragon.subscribe('update-msg', $scope.channel, {}).then(function(response) {
             });
           } else {
             growl.error("An error occurred during the rendering!", {});
           }
         });
       }
 }]);

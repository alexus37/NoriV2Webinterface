'use strict';
angular.module('myApp.basicWebSocketPatches')
//configure the $routeProvider, that if the /basic url is called that View1Ctrl is the current controller
.config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
    $routeProvider.when('/basicWebSocketPatches', {
        templateUrl: 'basicWebSocketPatches/basicWebSocketPatches.html',
        controller: 'basicWebSocketPatches1Ctrl'
    }).otherwise({redirectTo: '/login'});
    growlProvider.globalTimeToLive(3000);
}])

/**
 * @ngdoc controller
 * @name myApp.basic.controller:View1Ctrl

 * @requires $scope
 * @requires growl

 * @author Alexander Lelidis
 * @description
 * This controller does most of the computation.
 */
 .controller('basicWebSocketPatches1Ctrl', ["$scope", "growl", "communicationService", "$dragon",
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
       $scope.rendering = false;
       $scope.heightSet = false;



       $dragon.onReady(function() {
         // enable button
         $scope.sendDisabled = false;
       });

       $dragon.onChannelMessage(function(channels, message) {
         if (indexOf.call(channels, $scope.channel) > -1) {
           $scope.$apply(function() {

             $scope.percentage = message.data['percentage'];
             var b64Data = "data:image/png;base64,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";
             var offsetX = message.data['x'];
             var offsetY = message.data['y'];
             
             if (!$scope.heightSet) {
             	var width = message.data['width'];
             	var height = message.data['height'];
             	$scope.setSize(width, height);
             }

             $scope.addPatch(offsetX, offsetY, b64Data);

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
         $scope.heightSet = false;
         $scope.percentage = 0;

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

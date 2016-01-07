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
         mode: 'xml',
         height: 100
       };
       $scope.channel = 'update-msg';
       $scope.percentage = 0;
       $scope.sendDisabled = true;
       $scope.rendering = false;
       $scope.heightSet = false;
       $scope.progressbarType = "";
       $scope.finished = false;
       $scope.showResult = false;


       $dragon.onReady(function() {
         // enable button
         $scope.sendDisabled = false;
       });
      $scope.codemirrorLoaded = function(_editor) {
        _editor.setSize("100%","90%");
      }

       $dragon.onChannelMessage(function(channels, message) {
         if (indexOf.call(channels, $scope.channel) > -1) {
           $scope.$apply(function() {
           	 $scope.progressbarType = "success";
             $scope.percentage = message.data['percentage'];
           	 $scope.percentageMsg = $scope.percentage.toString() + ' %';
             var b64Data = message.data['data'];
             var offsetX = message.data['x'];
             var offsetY = message.data['y'];
             var pWidth = message.data['patchHeight'];
             var pHeight = message.data['patchWidth'];

             if (!$scope.heightSet) {
             	var width = message.data['width'];
             	var height = message.data['height'];
             	$scope.setSize(width, height);
             	$scope.heightSet = true;
             }

             $scope.addPatch(offsetX, offsetY, pWidth, pHeight, b64Data);

             if(message.data['finished'] == true) {
               $dragon.unsubscribe('update-msg', $scope.channel, {}).then(function(response) {
               });
               growl.success("Image successfully rendered!", {});
               $scope.rendering = false;
               $scope.finalUrl = message.data['url'];
               $scope.finished = true;
               $scope.showResult = true;

               // Reload image
             }
           });
         }
       });



       // set up a communication service
       var comServ = new communicationService('../render/');

       $scope.sendCancel = function() {
          swampdragon.callRouter('control', 'update-msg', {command: 'cancel', taskId: $scope.serverTaskId}, function (context, data) {
            if(data['success']) {
               	growl.success("Rendering successfully canceled!", {});
         	} else {
         		growl.error("An error occurred during the termination!", {});
         	}
         	$scope.rendering = false;
          });
       };

       $scope.sendRequest = function(){

         var xmlQuery = {
           fileName: $scope.fileName,
           xmlData: $scope.xmlInput,
           sendMail: false,
           email: $scope.$parent.user.email
         };
         $scope.progressbarType = "info";
         $scope.percentageMsg = "loading models ...";

         $scope.rendering = true;
         $scope.finished = false;
         $scope.heightSet = false;
         $scope.percentage = 100;
         $scope.reset();

         var promise = comServ.httpPostRequest(xmlQuery);
         promise.success(function updateLines(payload){
           if(payload['finished'] == false) { // started running
             $scope.channel = payload['channelname'];
             $scope.serverTaskId = payload['taskId'];

             $dragon.subscribe('update-msg', $scope.channel, {}).then(function(response) {

             });
           } else {
             growl.error("An error occurred during the rendering!", {});
           }
         });
       };
 }]);

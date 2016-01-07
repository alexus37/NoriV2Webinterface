'use strict';
angular.module('myApp.editor')
//configure the $routeProvider, that if the /view1 url is called that View1Ctrl is the current controller
    .config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
        $routeProvider.when('/editor', {
            templateUrl: 'editor/editor.html',
            controller: 'editorCtrl'
        }).otherwise({redirectTo: '/login'});
        growlProvider.globalTimeToLive(3000);
    }])

    /**
     * @ngdoc controller
     * @name myApp.view3.controller:View3Ctrl

     * @requires $scope
     * @requires growl

     * @author Alexander Lelidis
     * @description
     * This controller does most of the computation.
     */
    .controller('editorCtrl', ["$scope", "growl", "communicationService", "$dragon",
        function ($scope, growl, communicationService, $dragon) {
            $scope.DOMVars = {
                editorCollapsed: false,
                imageCollapsed: true,
                percentage: 0,
                rendering: false,
                heightSet: false,
                progressbarType: "",
                percentageMsg: ""
            };
            $scope.channel = 'update-msg';

            $dragon.onReady(function() {
                console.log("dragon ready");
            });
            $dragon.onChannelMessage(function(channels, message) {
                if (indexOf.call(channels, $scope.channel) > -1) {
                    $scope.$apply(function() {
                        $scope.DOMVars.progressbarType = "success";
                        $scope.DOMVars.percentage = message.data['percentage'];
                        $scope.DOMVars.percentageMsg = $scope.DOMVars.percentage.toString() + ' %';
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
                            $dragon.unsubscribe('update-msg', $scope.channel, {}).then(function(response) {});
                            growl.success("Image successfully rendered!", {});
                            $scope.DOMVars.rendering = false;
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
                    $scope.DOMVars.rendering = false;
                });
            };

            $scope.toggleEditor = function() {
                $scope.DOMVars.editorCollapsed = !$scope.DOMVars.editorCollapsed;
                if (false == $scope.DOMVars.editorCollapsed) {
                    $scope.DOMVars.imageCollapsed = true;
                }

            };

            $scope.toggleImage = function() {
                $scope.DOMVars.imageCollapsed = !$scope.DOMVars.imageCollapsed;
                if (false == $scope.DOMVars.imageCollapsed) {
                    $scope.DOMVars.editorCollapsed = true;
                }
            };

            $scope.changeFkt = function(name) {
                $scope.$parent.changeViewModel(name);
            };

            $scope.renderFkt = function(xmlInput) {
                console.log(xmlInput);
                $scope.toggleEditor();
                $scope.toggleImage();
                sendRequest(false, xmlInput, "text.xml", $scope.$parent.user.email)
            };
            function sendRequest(sendMail, xmlInput, fileName, mailAddr){

                var xmlQuery = {
                    fileName: fileName,
                    xmlData: xmlInput,
                    sendMail: sendMail,
                    email: mailAddr
                };
                $scope.DOMVars.progressbarType = "info";
                $scope.DOMVars.percentageMsg = "loading models ...";

                $scope.DOMVars.rendering = true;
                $scope.heightSet = false;
                $scope.DOMVars.percentage = 100;
                $scope.reset();

                var promise = comServ.httpPostRequest(xmlQuery);
                promise.success(function updateLines(payload){
                    if(payload['finished'] == false) { // started running
                        $scope.channel = payload['channelname'];
                        $scope.serverTaskId = payload['taskId'];

                        $dragon.subscribe('update-msg', $scope.channel, {}).then(function(response) {});
                } else {
                    growl.error("An error occurred during the rendering!", {});
                }
                });
            };
        }
    ]
);





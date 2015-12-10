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

    /**
     * @ngdoc controller
     * @name myApp.basic.controller:View1Ctrl

     * @requires $scope
     * @requires growl

     * @author Alexander Lelidis
     * @description
     * This controller does most of the computation.
     */
    .controller('basicWebSocket1Ctrl', ["$scope", "growl", "communicationService", "$websocket", 
        function ($scope, growl, communicationService, $websocket) {
            $scope.xmlInput = "<scene>\n\t<sampler type=\"independent\">\n\t\t<integer name=\"sampleCount\" value=\"2\"/>\n\t</sampler>\n\t<integrator type=\"av\">\n\t\t<float name=\"length\" value=\"10\"/>\n\t</integrator>\n\t<camera type=\"perspective\">\n\t\t<transform name=\"toWorld\">\n\t\t\t<lookat target=\"-64.8161, 47.2211, 23.8576\" origin=\"-65.6055, 47.5762, 24.3583\" up=\"0.299858, 0.934836, -0.190177\"/>\n\t\t</transform>\n\t\t<float name=\"fov\" value=\"30\"/>\n\t\t<integer name=\"width\" value=\"768\"/>\n\t\t<integer name=\"height\" value=\"768\"/>\n\t</camera>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"ajax.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t</mesh>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"plane.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t\t<transform name=\"toWorld\">\n\t\t\t<scale value=\"100,1,100\"/>\n\t\t</transform>\n\t</mesh>\n</scene>\n";
            $scope.fileName = "sphere_side_mis.xml";
            $scope.imageData = "images/testImage.png";
            $scope.editorOptions = {
                lineWrapping : true,
                lineNumbers: true,
                theme:'twilight',
                mode: 'xml'
            };
            $scope.percentage = 0;            

            // set up a communication service
            var comServ = new communicationService('../render/');

            $scope.sendRequest = function(){                

                var xmlQuery = {
                        fileName: $scope.fileName,
                        xmlData: $scope.xmlInput,
                        sendMail: false,
                        email: $scope.$parent.user.email
                };
                
                var promise = comServ.httpPostRequest(xmlQuery);
                promise.success(function updateLines(payload){
                    if(payload['success']) {
                        var wsUrl = payload['webocketUrl'];

                        // set up web socket
                        var dataStream = $websocket(wsUrl);


                        dataStream.onMessage(function(message) {
                            var msg = JSON.parse(message.data);

                            if(!msg['finished'] == 'update') {
                                $scope.percentage = msg['percentage'];
                                $scope.imageData = msg['url'] + '?cacheBuster=' + Math.random();
                            } else {                                
                                dataStream.close();
                                growl.success("Image successfully rendered!", {});
                            }           
                        });
                        
                    } else {
                        growl.error("An error occurred during the rendering!", {});
                    }
                });
            }            
        }]);





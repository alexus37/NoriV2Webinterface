'use strict';
angular.module('myApp.view1')
//configure the $routeProvider, that if the /view1 url is called that View1Ctrl is the current controller
    .config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
        growlProvider.globalTimeToLive(3000);
    }])

    /**
     * @ngdoc controller
     * @name myApp.view1.controller:View1Ctrl

     * @requires $scope
     * @requires growl

     * @author Alexander Lelidis
     * @description
     * This controller does most of the computation.
     */
    .controller('View1Ctrl', ["$scope", "growl", "communicationService",
        function ($scope, growl, communicationService) {
            $scope.xmlInput = "<scene>\n\t<sampler type=\"independent\">\n\t\t<integer name=\"sampleCount\" value=\"2\"/>\n\t</sampler>\n\t<integrator type=\"av\">\n\t\t<float name=\"length\" value=\"10\"/>\n\t</integrator>\n\t<camera type=\"perspective\">\n\t\t<transform name=\"toWorld\">\n\t\t\t<lookat target=\"-64.8161, 47.2211, 23.8576\" origin=\"-65.6055, 47.5762, 24.3583\" up=\"0.299858, 0.934836, -0.190177\"/>\n\t\t</transform>\n\t\t<float name=\"fov\" value=\"30\"/>\n\t\t<integer name=\"width\" value=\"768\"/>\n\t\t<integer name=\"height\" value=\"768\"/>\n\t</camera>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"../obj/ajax.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t</mesh>\n\t<mesh type=\"obj\">\n\t\t<string name=\"filename\" value=\"../obj/plane.obj\"/>\n\t\t<bsdf type=\"diffuse\"/>\n\t\t<transform name=\"toWorld\">\n\t\t\t<scale value=\"100,1,100\"/>\n\t\t</transform>\n\t</mesh>\n</scene>\n";
            $scope.fileName = "sphere_side_mis.xml";
            $scope.imageData = "images/testImage.png";
            $scope.editorOptions = {
                lineWrapping : true,
                lineNumbers: true,
                theme:'twilight',
                mode: 'xml'
            };

            // set up a communication service
            var comServ = new communicationService('http://127.0.0.1:7001/xmlrequest');            

            $scope.sendRequest = function(){

                var xmlQuery = {
                        fileName: $scope.fileName,
                        xmlData: $scope.xmlInput,
                        sendMail: false,
                        email: "mail@smt.de"
                };
                
                var promise = comServ.httpPostRequest(xmlQuery);
                promise.success(function updateLines(payload){
                    $scope.imageData = payload['imgUrl'];
                    growl.success("Image successfully rendered!", {}); 
                });
            }
        }]);





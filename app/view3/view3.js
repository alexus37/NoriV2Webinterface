'use strict';
angular.module('myApp.view3')
//configure the $routeProvider, that if the /view1 url is called that View1Ctrl is the current controller
    .config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
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
    .controller('View3Ctrl', ["$scope", "growl", "communicationService",
        function ($scope, growl, communicationService) {
            $scope.DOMVars = {
                    imageData: "images/testImage.png",
                    editorCollapsed: false,
                    imageCollapsed: true
                };

            // set up a communication service
            var comServ = new communicationService('http://127.0.0.1:7001/xmlrequest');

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
            $scope.renderFkt = function(xmlInput) {
                console.log(xmlInput);
                sendRequest(false, xmlInput, "text.xml", "demo@demo.de")
            };

            function sendRequest(sendMail, xmlInput, fileName, mailAddr){
                var xmlQuery = {
                    fileName: fileName,
                    xmlData: xmlInput,
                    sendMail: sendMail,
                    email: mailAddr
                };

                var promise = comServ.httpPostRequest(xmlQuery);
                promise.success(function updateLines(payload){
                    $scope.DOMVars.imageData = payload['imgUrl'];
                    $scope.toggleImage();
                    growl.success("Image successfully rendered!", {});
                });
            }
        }]);





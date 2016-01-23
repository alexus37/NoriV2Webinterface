'use strict';
angular.module('myApp.upload')
//configure the $routeProvider, that if the /view1 url is called that View1Ctrl is the current controller
    .config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'upload/upload.html',
            controller: 'uploadCtrl'
        }).otherwise({redirectTo: '/login'});
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
    .controller('uploadCtrl', ["$scope", "growl", "$http", "FileUploader", "$cookies",
        function ($scope, growl, $http, FileUploader, $cookies) {
            
            function getUserURL() {
                // send request to get the user url ToDo
                return $scope.$parent.user.url;
            }

            // set up the url
            var url = getUserURL() + 'resource';


            var uploadedFiles = $scope.uploadedFiles = [];
            $scope.assimpModelUrl = "";

            var uploader = $scope.uploader = new FileUploader({
                url: url,
                method: 'PUT',
                headers : {
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Authorization': 'Basic ' + $scope.$parent.globals.currentUser.authdata
                }
            });


            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    //check for obj files
                    var re = /(?:\.([^.]+))?$/;
                    var extension = re.exec(item.name)[1];  
                    if (extension === null) return false;
                    if (extension != "obj") return false;
                    if (item.type != "application/x-tgif") return false;
                    return this.queue.length < 10;
                }
            });

            function updateFileList(){
                $http.get(url).success(function updateList(payload){
                    $scope.uploadedFiles = uploadedFiles = payload;
                });
            };



            $scope.loadObjModel = function(item) {
                $scope.assimpModelUrl = $scope.$parent.user.username + "/" + item;
            };

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                if (status == 201) {
                    growl.success("File " + fileItem.file.name + " successfully uploaded!", {}); 
                } else if(status == 409) {
                    growl.success("File " + fileItem.file.name + " all ready exists!", {});
                } else {
                    growl.error("File " + fileItem.file.name + " upload failed!", {});
                    growl.error(response.detail, {});
                }
            };
            uploader.onCompleteAll = function() {
                updateFileList();
                console.info('onCompleteAll');
            };

            $scope.$on('$viewContentLoaded', function(){
                //Here your view content is fully loaded !!
                updateFileList();
            });
        }]);





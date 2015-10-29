'use strict';
angular.module('myApp.view2')
//configure the $routeProvider, that if the /view1 url is called that View1Ctrl is the current controller
    .config(['$routeProvider', 'growlProvider', function ($routeProvider, growlProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
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
    .controller('View2Ctrl', ["$scope", "growl", "communicationService", "FileUploader", 
        function ($scope, growl, communicationService, FileUploader) {
            // set up a communication service
            var comServ = new communicationService('http://127.0.0.1:7001/objUpload');
            var uploadedFiles = $scope.uploadedFiles = [];
            $scope.assimpModelUrl = "data/testUser/obj/mesh_3.obj";
            var uploader = $scope.uploader = new FileUploader({
                url: '../objUpload'
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
                var promise = comServ.httpGetRequest();
                promise.success(function updateList(payload){
                    $scope.uploadedFiles = uploadedFiles = payload;
                });
            }
            updateFileList();

            $scope.loadObjModel = function(item) {
                $scope.assimpModelUrl = "data/testUser/obj/" + item;
            }

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
                if (response["msg"] == "success") {
                    growl.success("File " + fileItem.file.name + " successfully uploaded!", {}); 
                } else {
                    growl.error("File " + fileItem.file.name + " upload failed!", {})
                }
            };
            uploader.onCompleteAll = function() {
                updateFileList()
                console.info('onCompleteAll');
            };
        }]);





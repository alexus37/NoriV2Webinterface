'use strict';

var module = angular.module('myApp.basicWebSocketPatches');

module.directive('renderCanvas', function() {
	return {
		restrict: 'A',
		scope: {
			addPatch: '=',
			setSize: '=',
			reset: '='
		},
        link: function(scope, element, attrs) {
        	console.log("canvas loaded!");
      		var ctx = element[0].getContext('2d');
      
			// canvas reset
			scope.reset =  function(){
				ctx.clearRect(0, 0, element[0].width, element[0].height);
			};
			scope.setSize =  function(width, height) {
				element[0].width = width;
				element[0].height = height;
			};
			scope.addPatch = function(offsetX, offsetY, patchsizeWidth, patchsizeHeight, b64Data) {
				var img = new Image();
				img.src = b64Data;
				img.onload = function () {
					ctx.drawImage(img, offsetX, offsetY);
				}
				
			};
		}
    };
});
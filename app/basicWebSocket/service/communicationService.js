'use strict';

var module = angular.module('myApp.basicWebSocket');
/**
 * @ngdoc service
 * @name myApp.basicWebSocket.communicationService
 * @requires $http
 * @requires reArrangingService
 * @author Alexander Lelidis
 * @description
 * Service to talk with backend api and also prepare the data for the charts.
 */
module.service('communicationService', ['$http',  function($http){
    /**
     * @ngdoc
     * @methodOf myApp.basicWebSocket.communicationService
     * @name myApp.basicWebSocket.communicationService#communicationService
     * @description
     * Constructor
     * @param {string} url The url for the server requests.
     * @returns {communicationService} Instance of the service.
     */
	var communicationService = function(url) {
        this.url = url;
    };
    /**
     * @ngdoc
     * @methodOf myApp.basicWebSocket.communicationService
     * @name myApp.basicWebSocket.communicationService#httpPostRequest
     * @description
     * Send a http post request.
     * @param {object} geoQuery The query, which is send to the url via http post.
     * @returns {HttpPromise} HttpPromise resolve with fetched data, or fails with error description.
     */
    communicationService.prototype.httpPostRequest = function(Query){
        return $http.post(this.url, Query);
    };

    /**
     * @ngdoc
     * @methodOf myApp.basicWebSocket.communicationService
     * @name myApp.basicWebSocket.communicationService#httpGetRequest
     * @description
     * Send a http post request.
     * @param {object} geoQuery The query, which is send to the url via http post.
     * @returns {HttpPromise} HttpPromise resolve with fetched data, or fails with error description.
     */
    communicationService.prototype.httpGetRequest = function(Query){
        return $http.get(this.url, Query);
    };

    return communicationService;
}]);
'use strict';

/* Services */

var samtServices = angular.module('samtServices', ['ngResource']);
//var serverUrl = 'http://localhost/';
var serverUrl = 'http://54.191.191.173/';

samtServices.factory('Phone', 
		['$resource',
		 function($resource){
			return $resource('phones/:phoneId.json', {}, {
				query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
			});
		}]);

samtServices.factory('Noticia', 
		['$resource',
		 function($resource){
			return $resource(serverUrl+'api/noticias', {}, {
				//query: {method:'GET', params:{noticiaId:'noticias'}, isArray:true}
			});
		}]);

samtServices.factory('Parceiro', 
		['$resource',
		 function($resource){
			return $resource(serverUrl+'api/parceiros', {}, {
				//query: {method:'GET', params:{parceiroId:'parceiros'}, isArray:true}
			});
		}]);

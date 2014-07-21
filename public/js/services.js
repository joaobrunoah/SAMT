'use strict';

/* Services */

var samtServices = angular.module('samtServices', ['ngResource']);

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
			return $resource('http://localhost/api/noticias', {}, {
				//query: {method:'GET', params:{noticiaId:'noticias'}, isArray:true}
			});
		}]);

samtServices.factory('Parceiro', 
		['$resource',
		 function($resource){
			return $resource('http://localhost/api/parceiros', {}, {
				//query: {method:'GET', params:{parceiroId:'parceiros'}, isArray:true}
			});
		}]);

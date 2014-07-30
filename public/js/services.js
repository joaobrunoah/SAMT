'use strict';

/* Services */

var samtServices = angular.module('samtServices', ['ngResource']);

samtServices.factory('Parceiro', 
		['$resource',
		 function($resource){
			return $resource('/api/parceiros', {}, {
				//query: {method:'GET', params:{parceiroId:'parceiros'}, isArray:true}
			});
		}]);

samtServices.factory('Projeto',
		['$resource',
		 function($resource){
			return $resource('/api/projetos/:projetoId', {}, {
				get: {method:'GET', params:{projetoId:'projetoId'}, isArray:false}
			});
		}]);

samtServices.factory('Noticia', 
		['$resource',
		 function($resource){
			return $resource('/api/noticias/:noticiaId', {}, {
				get: {method:'GET', params:{noticiaId:'noticiaId'}, isArray:false}
			});
		}]);

samtServices.factory('Evento', 
		['$resource',
		 function($resource){
			return $resource('/api/eventos/:eventoId', {}, {
				get: {method:'GET', params:{eventoId:'eventoId'}, isArray:false}
			});
		}]);

samtServices.factory('AuthenticationService', function() {
	var auth = {
		isLogged: false
	}
	return auth;
});

samtServices.factory('UserService', function($http) {
    return {
        Login: function(username, password) {
            return $http.post('/api/login', {username: username, password: password});
        },
 
        Logout: function() {
 
        }
    }
});


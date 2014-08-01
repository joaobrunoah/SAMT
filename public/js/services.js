'use strict';

/* Services */

var samtServices = angular.module('samtServices', ['ngResource']);

samtServices.factory('AuthenticationService', function() {
	var auth = {
		isLogged: false
	}
	return auth;
});

samtServices.factory('Parceiro',
		['$resource',
		 function($resource){
			return $resource('/api/parceiros/:parceiroId', {}, {
				//query: {method:'GET', params:{parceiroId:'parceiros'}, isArray:true}
				delete: {method:'DELETE',params:{parceiroId:'parceiroId'}}
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

samtServices.factory('UserService', function($http) {
    return {
        Login: function(username, password) {
            return $http.post('/api/login', {'username': username, 'password': password});
        },
 
        Logout: function() {
 
        }
    }
});

samtServices.service('elementUpload',['$http',function($http){
    this.postElement = function(info,uploadUrl){
        var formData = new FormData();
        formData.append('image',info.image);
        formData.append('nome',info.nome);
        formData.append('url',info.url);
        formData.append('titulo',info.titulo);
        formData.append('resumo',info.resumo);
        formData.append('texto',info.texto);
        formData.append('local',info.local);
        formData.append('data',info.data);
        formData.append('distanceTop',info.distanceTop);

        return $http.post(uploadUrl,formData,{
            transformRequest:angular.identity,
            headers:{'Content-Type': undefined}
        });
    }

    this.updateElement = function(info,uploadUrl){
        alert(uploadUrl);
        var formData = new FormData();
        if(info.image != undefined) {
            formData.append('image', info.image);
        }
        formData.append('nome',info.nome);
        formData.append('url',info.url);
        formData.append('titulo',info.titulo);
        formData.append('resumo',info.resumo);
        formData.append('texto',info.texto);
        formData.append('local',info.local);
        formData.append('data',info.data);
        formData.append('distanceTop',info.distanceTop);

        return $http.put(uploadUrl,formData,{
            transformRequest:angular.identity,
            headers:{'Content-Type': undefined}
        });
    }
}]);

samtServices.service('htmlCompiler',['$sce',function($sce){
    this.compile = function(text){
        text = text.replace(/\n/g,"<br/>");
        var html = $sce.trustAsHtml(text);
        return html;
    };
}]);
'use strict';

/* Services */

var samtServices = angular.module('samtServices', ['ngResource']);

samtServices.factory('AuthenticationService', function() {
	var auth = {
		isLogged: false
	};
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
                query: {method:'GET',isArray:false},
				get: {method:'GET', params:{noticiaId:'noticiaId'}, isArray:false}
			});
		}]);

samtServices.factory('Evento',
    ['$resource',
        function($resource){
            return $resource('/api/eventos/:eventoId', {}, {
                query: {method:'GET',isArray:false},
                get: {method:'GET', params:{eventoId:'eventoId'}, isArray:false}
            });
        }]);

samtServices.factory('UserService', function($http) {
    return {
        Login: function(username, password) {
            return $http.post('/api/login', {'username': username, 'password': password});
        },
 
        Logout: function() {
 
        },

        MudarSenha: function(senhaAntiga,senhaNova,usuario) {
            return $http.put('api/user/mudar_senha',{'senha_nova': senhaNova, 'senha_antiga': senhaAntiga, 'usuario':usuario});
        },

        AdicionarUsuario: function(usuario,senha) {
            return $http.post('api/user/add',{'usuario': usuario, 'senha': senha});
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
    };

    this.updateElement = function(info,uploadUrl){
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
    };

    this.uploadFoto = function(image,tipo,id){
        var formData = new FormData();
        formData.append('image',image);
        return $http.post('/api/'+tipo+'/imagem/'+id,formData,{
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
        });
    }

    this.deleteFoto = function(nomeFoto,tipo,id){
        return $http.delete('/api/'+tipo+'/imagem/'+id+"/"+nomeFoto);
    }
}]);

samtServices.service('htmlCompiler',['$sce',function($sce){
    this.compile = function(text){
        text = text.replace(/\n/g,"<br/>");
        return $sce.trustAsHtml(text);
    };
}]);

samtServices.service('galeriaFotos',[function(){

        this.gerarUrlImagem = function(foto,tipo,id){
            if(foto.imagem_elemento != undefined){
                foto.imagemUrl = 'img/'+tipo+'/'+id+'/'+foto.imagem_elemento.name;
            }
            return foto.imagemUrl;
        };

        this.getNomeFoto = function(foto){
            if(foto.imagem_elemento != undefined){
                return foto.imagem_elemento.name;
            }
            return foto.imagemUrl.substring(foto.imagemUrl.lastIndexOf('/')+1,foto.imagemUrl.length);
        };

        this.tratarNomeArquivos = function(fotos,tipo,id){
            var novoFotos = [];

            if(fotos != undefined) {
                for (var i = 0; i < fotos.length; i++) {
                    var foto = {};
                    foto.nome = fotos[i].nome;
                    foto.imagemUrl = this.gerarUrlImagem(fotos[i], tipo, id);

                    novoFotos.push(foto);
                }
            }
            return novoFotos;
        };

        this.transformarMatriz = function(elementos){
            var array = [];
            var subarray = [];
            if(elementos != undefined) {
                for (var i = 0; i < elementos.length; i++) {
                    subarray.push(elementos[i]);
                    if (subarray.length >= 3) {
                        array.push(subarray);
                        subarray = [];
                    }
                }
                if (subarray.length > 0) {
                    array.push(subarray);
                }
            }

            return array;
        };

        this.transformarArray = function(matriz){
            var array = [];
            var linha = [];
            if(matriz != undefined) {
                for (var i = 0; i < matriz.length; i++) {
                    linha = matriz[i];
                    for (var j = 0; j < linha.length; j++) {
                        array.push(linha[j]);
                    }
                }
            }
            return array;
        };
    }]);
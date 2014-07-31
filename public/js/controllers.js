'use strict';

/* Controllers */

var samtControllers = angular.module('samtControllers', []);

samtControllers.controller('TopNavCtrl',
		['$scope','$location','AuthenticationService','$window','$http',
		 function($scope,$location,AuthenticationService,$window,$http){
			
			$http.get('texts/texts.json').success(function(data) {
		        // you can do some processing here
		    	$scope.texts = data;
		    });
		    
			$scope.getClass = function(path) {
				if ($location.path().substr(0, path.length) == path) {
					return "active"
				} else {
				    return ""
				}
			}
			
			$scope.logoutAppear = function(){
				if(!AuthenticationService.isLogged && $window.localStorage.samtToken
						&& $window.localStorage.expirationDate >= Date.now()){
					AuthenticationService.isLogged = true;
					return "appear";
				}
				if(AuthenticationService.isLogged){
					return "appear";
				}
				return "";
			}
			
			$scope.userLogout = function() {
				if (AuthenticationService.isLogged) {
					AuthenticationService.isLogged = false;
					delete $window.localStorage.samtToken;
					delete $window.localStorage.expirationDate;
				}
			}
			
		 }]);

/*samtControllers.controller('CubeCtrl',
		['$scope','$interval',
		 function($scope,$interval){
			var selection = ["back-selected","left-selected","front-selected","right-selected"];
			var arraySelected = 0;
			$scope.faceSelected = selection[arraySelected];
			$scope.getFaceSelected = function(){
				return $scope.faceSelected;
			};
//			$scope.setFaceSelected = function(face){
//				$scope.faceSelected = face;
//			};
			
			$interval(function(){
				arraySelected +=1;
				if(arraySelected>=selection.length){
					arraySelected = 0;
				}
				$scope.faceSelected = selection[arraySelected];
			},2000);
		 }]); */

samtControllers.controller('InicioCtrl', 
		['$scope', '$http','$interval','Noticia','Projeto',
		 function($scope, $http, $interval, Noticia,Projeto) {
			
			var tempoEntreNoticias = 5000;
			
			$scope.abaNoticia=true;
			$scope.abaEvento=false;
			
			$scope.newsCounter = 0;
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.noticias = Noticia.query();
			$scope.projetos = Projeto.query();
			$scope.ordenarPor = '-data';
			
			$interval(function(){
				var menorRand = 1;
				var selectedProject = 0;
				$scope.activeNoticia=$scope.noticias[0]._id;
				for (var i = 0; i<$scope.projetos.length; i++){
					$scope.projetos[i].random = Math.random();
					if($scope.projetos[i].random<menorRand){
						menorRand = $scope.projetos[i].random;
						selectedProject = i;
					}
				}
				$scope.activeProjeto=$scope.projetos[selectedProject]._id;
			},2000,1);
			
			/* FUNCOES DE NOTICIA */
			
			$scope.selectAba = function(aba){
				if(aba=='noticia'){
					$scope.abaNoticia=true;
					$scope.abaEvento=false;
				} else if(aba=='evento'){
					$scope.abaNoticia=false;
					$scope.abaEvento=true;
				} else {
					$scope.abaNoticia=true;
					$scope.abaEvento=false;
				}
			}
			
			$scope.isNoticiaActive = function(idNoticia){
				if (idNoticia==$scope.activeNoticia){
					return "active";
				} else {
					return "";
				}
			}
			
			$scope.setNoticiaActive = function(idNoticia){
				$scope.activeNoticia=idNoticia;
				$scope.newsCounter = idNoticia-1;
				$interval.cancel($scope.iterateOverNews);
				$scope.iterateOverNews = $interval(function(){
					$scope.newsCounter += 1;
					if($scope.newsCounter >= $scope.noticias.length){
						$scope.newsCounter = 0;
					}
					$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
					$interval.cancel($scope.iterateOverNews);
					$scope.iterateOverNews = $interval(function(){
						$scope.newsCounter += 1;
						if($scope.newsCounter >= $scope.noticias.length){
							$scope.newsCounter = 0;
						}
						$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
						
					},5000);
				},20000);
			}
			
			$scope.getNoticia = function(){
				for (var i=0; i<$scope.noticias.length; i++) {
					if($scope.noticias[i]._id==$scope.activeNoticia){
						return $scope.noticias[i];
					}
				}
				return null;
			}
			
			$scope.iterateOverNews = $interval(function(){
				$scope.newsCounter += 1;
				if($scope.newsCounter >= $scope.noticias.length){
					$scope.newsCounter = 0;
				}
				$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
			},5000);
			
			/* toRight = 1 => right */
			$scope.iterateNews = function(toRight){
				$interval.cancel($scope.iterateOverNews);
				if (toRight == 1) {
					$scope.newsCounter += 1;
					if($scope.newsCounter >= $scope.noticias.length){
						$scope.newsCounter = 0;
					}
					$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
				} else {
					$scope.newsCounter -= 1;
					if($scope.newsCounter < 0 ){
						$scope.newsCounter = $scope.noticias.length-1;
					}
					$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
				}
				$scope.iterateOverNews = $interval(function(){
					$scope.newsCounter += 1;
					if($scope.newsCounter >= $scope.noticias.length){
						$scope.newsCounter = 0;
					}
					$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
					
					$interval.cancel($scope.iterateOverNews);
					$scope.iterateOverNews = $interval(function(){
						$scope.newsCounter += 1;
						if($scope.newsCounter >= $scope.noticias.length){
							$scope.newsCounter = 0;
						}
						$scope.activeNoticia=$scope.noticias[$scope.newsCounter]._id;
						
					},5000);
				},20000);
			}
			
			/* FIM DE FUNCOES DE NOTICIA */
			
			/* FUNCOES DE PROJETO */
			
			$scope.isProjectActive = function(idProjeto){
				if (idProjeto==$scope.activeProjeto){
					return "active";
				} else {
					return "";
				}
			}
			
			$scope.setProjectActive = function(idProjeto){
				$scope.activeProjeto=idProjeto;
			}
			
			$scope.isLast = function($last){
				if($last){
					return 'last';
				}
				return '';
			}
			
			$scope.isMiddle = function($middle){
				if($middle){
					return 'middle';
				}
				return '';
			}
			
			/* FIM DE FUNCOES DE PROJETO */
			
		}]);

samtControllers.controller('QuemSomosCtrl', 
		['$scope','$http','$sce','AuthenticationService',
		 function($scope,$http,$sce,AuthenticationService) {
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.titulo_secao = data.quem_somos;
		    	$scope.texto_secao = $sce.trustAsHtml(data.quem_somos_text);
		    	$scope.imagem_secao = data.quem_somos_imagem;
		    });
			
			$scope.mustAppear = function(subsecao) {
				if(subsecao == 'texto'){
					return "appear";
				} 
				return "";
			}
			
			$scope.isLoggedIn = function() {
				return AuthenticationService.isLogged;
			}
		}]);

samtControllers.controller('ParceirosCtrl', 
		['$scope','$interval','Parceiro','AuthenticationService','$window',
		 function($scope,$interval,Parceiro,AuthenticationService,$window) {
			
			var parceiros = Parceiro.query();
			$scope.parceirosArray=[];
			$interval(function(){
				var adicionarParceiro = {
						imagemUrl: "img/site/adicionar.jpg",
						nome: "Adicionar Parceiro",
						url: "/#/adicionar_parceiro"
				}
				var parceirosTemp = [];
				var parceirosArrayTemp = [];
				var iMax = parceiros.length;
				for(var i=0;i<iMax;i++){
					parceirosTemp.push(parceiros[i]);
					if (i>=iMax-1) {
						if($scope.isLoggedIn()){
							if(i%3==2){
								parceirosArrayTemp.push(parceirosTemp);
								parceirosTemp = [];
								parceirosTemp.push(adicionarParceiro);
								parceirosArrayTemp.push(parceirosTemp);
							} else {
								parceirosTemp.push(adicionarParceiro);
								parceirosArrayTemp.push(parceirosTemp);
								
							}
						} else {
							parceirosArrayTemp.push(parceirosTemp);
						}
					} else if(i%3==2){
						parceirosArrayTemp.push(parceirosTemp);
						parceirosTemp = [];
					} 
				}
				$scope.parceirosArray=parceirosArrayTemp;
			},100,10);
			
			$scope.isLoggedIn = function() {
				return AuthenticationService.isLogged;
			}
			
			$scope.excluirParceiro = function(id) {
				var objToRemove = {};
				objToRemove.id = id;
				Parceiro.remove(objToRemove);
			}
		}]);

samtControllers.controller('ProjetosCtrl', 
		['$scope','$http','$interval','$location','Projeto','AuthenticationService',
		 function($scope,$http,$interval,$location,Projeto,AuthenticationService) {
			
			$scope.tipo_elemento = 'projetos';
			
			var idElementSelected = null;
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.titulo_secao = data.projetos;
		    });
			
			$scope.elementos = Projeto.query();
			
			var mudarNomeParaTitulo = $interval(function(){
				var i = 0;
				for(i = 0; i<$scope.elementos.length; i++) {
					$scope.elementos[i].titulo = $scope.elementos[i].nome;
				}
				if (i!= 0){
					$interval.cancel(mudarNomeParaTitulo);
				}
			},200,20)
			
			$scope.isElementSelected = function(id) {
				
				if(id == idElementSelected){
					return "selected";
				}
				return "";
			}
			
			$scope.selectElement = function(id) {
				if(!$scope.isLoggedIn()){
					idElementSelected = id;
				}
			}
			
			$scope.isLoggedIn = function() {
				return AuthenticationService.isLogged;
			}
			
		}]);

samtControllers.controller('NoticiasCtrl', 
		['$scope','$http','$location','Noticia','AuthenticationService',
		 function($scope,$http,$location,Noticia,AuthenticationService) {
			
			$scope.tipo_elemento = 'noticias';
			
			var idElementSelected = null;
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.titulo_secao = data.noticias;
		    });
			
			$scope.elementos = Noticia.query();
			
			$scope.isElementSelected = function(id) {
				if(id == idElementSelected){
					return "selected";
				}
				return "";
			}
			
			$scope.selectElement = function(id) {
				idElementSelected = id;
			}
			
			$scope.isLoggedIn = function() {
				return AuthenticationService.isLogged;
			}
			
		}]);

samtControllers.controller('EventosCtrl', 
		['$scope','$http','$location','Evento','AuthenticationService',
		 function($scope,$http,$location,Evento,AuthenticationService) {
			
			$scope.tipo_elemento = 'eventos';
			
			var idElementSelected = null;
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.titulo_secao = data.eventos;
		    });
			
			$scope.elementos = Evento.query();
			
			$scope.isElementSelected = function(id) {
				if(id == idElementSelected){
					return "selected";
				}
				return "";
			}
			
			$scope.selectElement = function(id) {
				idElementSelected = id;
			}
			
			$scope.isLoggedIn = function() {
				return AuthenticationService.isLogged;
			}
			
		}]);

samtControllers.controller('SecaoProjetoCtrl', 
		['$scope', '$http','$routeParams', 'Projeto',
		 function($scope,$http, $routeParams, Projeto) {
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.projeto = Projeto.get({projetoId: $routeParams.projetoId}, function(projeto) {
				$scope.imagem_secao = projeto.imagemUrl;
				$scope.titulo_secao = projeto.nome;
				$scope.texto_secao = projeto.resumo;
			});
			
			$scope.mustAppear = function(item){
				if(item == 'texto'|| item == 'fotos'){
					return 'appear';
				}
				return "";
			}
			
		}]);

samtControllers.controller('SecaoNoticiaCtrl', 
		['$scope', '$http', '$routeParams', 'Noticia',
		 function($scope, $http, $routeParams, Noticia) {
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.noticia = Noticia.get({noticiaId: $routeParams.noticiaId}, function(noticia) {
				$scope.imagem_secao = noticia.imagemUrl;
				$scope.titulo_secao = noticia.titulo;
				$scope.texto_secao = noticia.texto;
				$scope.data_secao = noticia.data;
			});
			
			$scope.mustAppear = function(item){
				if(item == 'texto'|| item == 'fotos' || item == 'data'){
					return 'appear';
				}
				return "";
			}
		}]);

samtControllers.controller('SecaoEventoCtrl', 
		['$scope', '$http', '$routeParams', 'Evento',
		 function($scope, $http, $routeParams, Evento) {
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.evento = Evento.get({eventoId: $routeParams.eventoId}, function(evento) {
				$scope.imagem_secao = evento.imagemUrl;
				$scope.titulo_secao = evento.titulo;
			});
		}]);

samtControllers.controller('AdminCtrl', 
		['$scope', '$http', '$window', '$location', 'AuthenticationService', 'UserService',
		 function($scope, $http, $window, $location, AuthenticationService, UserService) {
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			//Admin User Controller (login, logout)
			$scope.Login = function(credentials) {
				var username = credentials.username;
				var password = credentials.password;
				if (username !== undefined && password !== undefined) {
					UserService.Login(username, password).success(function(data) {
						AuthenticationService.isLogged = true;
						$window.localStorage.samtToken = data.samtToken;
						$window.localStorage.expirationDate = data.expires;
						$location.path("/");
					}).error(function(status, data) {
						alert(status);
						//console.log(data);
					});
				}
			}	
		}]);

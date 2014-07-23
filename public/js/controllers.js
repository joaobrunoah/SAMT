'use strict';

/* Controllers */

var samtControllers = angular.module('samtControllers', []);

samtControllers.controller('TopNavCtrl',
		['$scope','$location','$http',
		 function($scope,$location,$http){
			
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
			
			$scope.newsCounter = 0;
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.noticias = Noticia.query();
			$scope.projetos = Projeto.query();
			$scope.ordenarPor = '-data';
			
			$interval(function(){
				$scope.activeNoticia=$scope.noticias[0]._id;
				$scope.activeProjeto=$scope.projetos[0]._id;
			},2000,1);
			
			/* FUNCOES DE NOTICIA */
			
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
				},5000);
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
				},5000);
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
			
			/* FIM DE FUNCOES DE PROJETO */
			
		}]);

samtControllers.controller('QuemSomosCtrl', 
		['$scope','$http',
		 function($scope,$http) {
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
		}]);

samtControllers.controller('ParceirosCtrl', 
		['$scope','$http','Parceiro',
		 function($scope,$http,Parceiro) {
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.parceiros = Parceiro.query();
			
		}]);

samtControllers.controller('PhoneDetailCtrl', 
		['$scope', '$routeParams', 'Phone',
		 function($scope, $routeParams, Phone) {
			$scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
				$scope.mainImageUrl = phone.images[0];
			});

			$scope.setImage = function(imageUrl) {
				$scope.mainImageUrl = imageUrl;
			}
		}]);
		
samtControllers.controller('NoticiaDetailCtrl', 
		['$scope', '$routeParams', 'Noticia',
		 function($scope, $routeParams, Noticia) {
			$scope.noticia = Noticia.get({noticiaId: $routeParams.noticiaId}, function(noticia) {
				$scope.mainImageUrl = noticia.images[0];
			});

			$scope.setImage = function(imageUrl) {
				$scope.mainImageUrl = imageUrl;
			}
		}]);

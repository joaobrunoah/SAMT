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

samtControllers.controller('CubeCtrl',
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
		 }]);

samtControllers.controller('InicioCtrl', 
		['$scope', '$http','$interval','Noticia',
		 function($scope, $http, $interval, Noticia) {
			
			$scope.projectCounter = 0;
			
			$http.get('texts/texts.json').success(function(data) {
		    	$scope.texts = data;
		    });
			
			$scope.noticias = Noticia.query();
			$scope.ordenarPor = '-data';
			
			$interval(function(){
				$scope.activeClass=$scope.noticias[0]._id;
			},200,1);
			
			
			$scope.getActiveClass = function(idProjeto){
				if (idProjeto==$scope.activeClass){
					return "active";
				} else {
					return "";
				}
			}
			
			$scope.setActiveClass = function(idProjeto){
				$scope.activeClass=idProjeto;
				$scope.projectCounter = idProjeto-1;
				$interval.cancel($scope.iterateOverProjects);
				$scope.iterateOverProjects = $interval(function(){
					$scope.projectCounter += 1;
					if($scope.projectCounter >= $scope.noticias.length){
						$scope.projectCounter = 0;
					}
					$scope.activeClass=$scope.noticias[$scope.projectCounter].num_id;
				},5000);
			}
			
			$scope.getActiveName = function(){
				for (var i=0; i<$scope.noticias.length; i++) {
					if($scope.noticias[i]._id==$scope.activeClass){
						return $scope.noticias[i].titulo;
					}
				}
				return "Nenhum Projeto Selecionado ";
			}
			
			$scope.iterateOverProjects = $interval(function(){
				$scope.projectCounter += 1;
				if($scope.projectCounter >= $scope.noticias.length){
					$scope.projectCounter = 0;
				}
				$scope.activeClass=$scope.noticias[$scope.projectCounter]._id;
			},5000);
			
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

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
		['$scope','$http','$sce',
		 function($scope,$http,$sce) {
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
		}]);

samtControllers.controller('ParceirosCtrl', 
		['$scope','$interval','Parceiro',
		 function($scope,$interval,Parceiro) {
			
			var parceiros = Parceiro.query();
			$scope.parceirosArray=[];
			$interval(function(){
				var parceirosTemp = [];
				var parceirosArrayTemp = [];
				var iMax = parceiros.length;
				for(var i=0;i<iMax;i++){
					parceirosTemp.push(parceiros[i]);
					if(i%3==2){
						parceirosArrayTemp.push(parceirosTemp);
						parceirosTemp = [];
					} else if (i==iMax-1) {
						parceirosArrayTemp.push(parceirosTemp);
					}
				}
				$scope.parceirosArray=parceirosArrayTemp;
			},100,10);
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

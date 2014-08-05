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

samtControllers.controller('InicioCtrl',
    ['$scope', '$http','$interval','Noticia','Projeto',
        function($scope, $http, $interval, Noticia,Projeto) {

            $scope.abaNoticia=true;
            $scope.abaEvento=false;

            $scope.newsCounter = 0;

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.noticias = {};

            $scope.noticiaQuery = Noticia.query(function(){
                $scope.noticias = $scope.noticiaQuery.elementos;
            });
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
                $scope.distance_top = data.quem_somos_distance_top;
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

samtControllers.controller('AdminCtrl',
    ['$scope', '$http', '$window', '$location', 'AuthenticationService', 'UserService','$route',
        function($scope, $http, $window, $location, AuthenticationService, UserService,$route) {

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
                        $http.defaults.headers.common['x-access-token'] = $window.localStorage.samtToken;
                        $window.localStorage.expirationDate = data.expires;
                        $window.localStorage.usuario = username;
                        $location.path("/");
                        $route.reload();
                    }).error(function(status, data) {
                        alert(status);
                        //console.log(data);
                    });
                }
            };

            $scope.isLoggedIn = function(){
                return AuthenticationService.isLogged;
            };

            $scope.passInfo = {};
            $scope.passInfo.confirmacao = '';

            $scope.userInfo = {};
            $scope.userInfo.confirmacao = '';

            $scope.mudarSenha = function(passInfo){
                if(passInfo.senhaNova != passInfo.confirmacao){
                    return;
                }
                UserService.MudarSenha(passInfo.senhaAntiga,passInfo.senhaNova,$window.localStorage.usuario).success(function(data,status){
                    alert(data);
                }).error(function(data,status){
                    alert(data);
                });
            };

            $scope.adicionarUsuario = function(userInfo){
                if(userInfo.senha != userInfo.confirmacao){
                    return;
                }
                UserService.AdicionarUsuario(userInfo.usuario,userInfo.senha).success(function(data,status){
                    alert(data);
                }).error(function(data,status){
                    alert(data);
                });
            };
        }]);

samtControllers.controller('TrabalheCtrl',
    ['$scope','$http','$sce','AuthenticationService',
        function($scope,$http,$sce,AuthenticationService) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.titulo_secao = data.trabalhe_conosco;
                $scope.texto_secao = $sce.trustAsHtml(data.trabalhe_text);
                $scope.imagem_secao = data.trabalhe_imagem;
                $scope.distance_top = data.trabalhe_distance_top;
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

samtControllers.controller('ContatoCtrl',
    ['$scope','$http','$sce','AuthenticationService',
        function($scope,$http,$sce,AuthenticationService) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.titulo_secao = data.contato;
                $scope.texto_secao = $sce.trustAsHtml(data.contato_text);
                $scope.imagem_secao = data.contato_imagem;
                $scope.distance_top = data.contato_distance_top;
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
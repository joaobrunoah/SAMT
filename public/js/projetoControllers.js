/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var projetoControllers = angular.module('projetoControllers', []);

projetoControllers.controller('ProjetosCtrl',
    ['$scope','$http','$interval','$location','Projeto','AuthenticationService','$route',
        function($scope,$http,$interval,$location,Projeto,AuthenticationService,$route) {

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
            },200,20);

            $scope.isElementSelected = function(id) {

                if(id == idElementSelected){
                    return "selected";
                }
                return "";
            };

            $scope.selectElement = function(id) {
                if(!$scope.isLoggedIn()){
                    idElementSelected = id;
                }
            };

            $scope.isLoggedIn = function() {
                return AuthenticationService.isLogged;
            }

            $scope.excluirElemento = function(id){
                var objToRemove = {};
                objToRemove.projetoId = id;
                Projeto.delete(objToRemove,function(){
                    $scope.elementos = Projeto.query();
                    $scope.$apply();
                    $route.reload();
                });
            }

            $scope.editarElemento = function(id) {
                $location.path("/projetos/editar/" + id);
                $route.reload();
            }

        }]);

projetoControllers.controller('SecaoProjetoCtrl',
    ['$scope', '$http','$routeParams', 'Projeto','$sce',
        function($scope,$http, $routeParams, Projeto,$sce) {
            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.projeto = Projeto.get({projetoId: $routeParams.projetoId}, function(projeto) {
                $scope.imagem_secao = projeto.imagemUrl;
                $scope.titulo_secao = projeto.nome;
                $scope.texto_secao = $sce.trustAsHtml(projeto.texto);
            });

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'){
                    return 'appear';
                }
                return "";
            }

        }]);

projetoControllers.controller('AdicionarProjetoCtrl',
    ['$scope','$http','$window','elementUpload',
        function($scope,$http,$window,elementUpload) {

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'||item=='preview'||item=='form_projeto'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.info = {
                titulo:"Escreva o Nome do Projeto Aqui",
                texto:"Escreva o texto do Projeto Aqui",
                resumo:"Escreva o resumo do Projeto Aqui"
            };

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;
                $scope.info.nome = $scope.info.titulo;
                elementUpload.postElement($scope.info,'/api/projetos').success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/projetos");
                        $route.reload();
                    }
                );
            }

        }]);

projetoControllers.controller('EditarProjetoCtrl',
    ['$scope','$http','$window','$location','$route','$routeParams','elementUpload','Projeto',
        function($scope,$http,$window,$location,$route,$routeParams,elementUpload,Projeto) {

            var projetoId = $routeParams.projetoId;

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'||item=='preview'||item=='form_projeto'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            Projeto.get({projetoId: projetoId}, function(projeto) {
                $scope.info = projeto;
                $scope.info.titulo = projeto.nome;
                $scope.srcimagem_elemento = projeto.imagemUrl;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;
                $scope.info.nome = $scope.info.titulo;
                elementUpload.updateElement($scope.info,'/api/projetos/'+projetoId).success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/projetos");
                        $route.reload();
                    }
                );

            }

        }]);
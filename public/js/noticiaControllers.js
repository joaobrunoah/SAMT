/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var noticiaControllers = angular.module('noticiaControllers', []);

noticiaControllers.controller('NoticiasCtrl',
    ['$scope','$http','$location','Noticia','AuthenticationService','$route',
        function($scope,$http,$location,Noticia,AuthenticationService,$route) {

            $scope.order_by="-data";

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

            $scope.excluirElemento = function(id){
                var objToRemove = {};
                objToRemove.noticiaId = id;
                Noticia.delete(objToRemove,function(){
                    $scope.elementos = Noticia.query();
                    $scope.$apply();
                    $route.reload();
                });
            }

            $scope.editarElemento = function(id) {
                $location.path("/noticias/editar/" + id);
                $route.reload();
            }

        }]);

noticiaControllers.controller('SecaoNoticiaCtrl',
    ['$scope', '$http', '$routeParams', 'Noticia','$sce',
        function($scope, $http, $routeParams, Noticia,$sce) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.noticia = Noticia.get({noticiaId: $routeParams.noticiaId}, function(noticia) {
                $scope.imagem_secao = noticia.imagemUrl;
                $scope.titulo_secao = noticia.titulo;
                $scope.texto_secao = $sce.trustAsHtml(noticia.texto);
                $scope.data_secao = noticia.data;
            });

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos' || item == 'data'){
                    return 'appear';
                }
                return "";
            }
        }]);

noticiaControllers.controller('AdicionarNoticiaCtrl',
    ['$scope','$http','$window','elementUpload',
        function($scope,$http,$window,elementUpload) {

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'|| item == 'data' || item=='preview'||item=='form_noticia'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.token = $window.localStorage.samtToken;

            scope.dataAtual = Date.now();

            $scope.info = {};

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;
                elementUpload.postElement($scope.info,'/api/noticias').success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/noticias");
                        $route.reload();
                    }
                );
            }

        }]);

noticiaControllers.controller('EditarNoticiaCtrl',
    ['$scope','$http','$window','$location','$route','$routeParams','elementUpload','Noticia',
        function($scope,$http,$window,$location,$route,$routeParams,elementUpload,Noticia) {

            var noticiaId = $routeParams.noticiaId;

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'|| item == 'data' || item=='preview'||item=='form_noticia'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            Noticia.get({noticiaId: noticiaId}, function(noticia) {
                $scope.info = noticia;
                $scope.srcimagem_elemento = noticia.imagemUrl;
                $scope.dataAtual = noticia.data;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;
                elementUpload.updateElement($scope.info,'/api/noticias/'+noticiaId).success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/noticias");
                        $route.reload();
                    }
                );

            }

        }]);
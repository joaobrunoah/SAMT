/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var eventoControllers = angular.module('eventoControllers', []);

eventoControllers.controller('EventosCtrl',
    ['$scope','$http','$location','Evento','AuthenticationService','$route',
        function($scope,$http,$location,Evento,AuthenticationService,$route) {

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

            $scope.excluirElemento = function(id){
                var objToRemove = {};
                objToRemove.eventoId = id;
                Evento.delete(objToRemove,function(){
                    $scope.elementos = Evento.query();
                    $scope.$apply();
                    $route.reload();
                });
            }

            $scope.editarElemento = function(id) {
                $location.path("/eventos/editar/" + id);
                $route.reload();
            }

        }]);

eventoControllers.controller('SecaoEventoCtrl',
    ['$scope', '$http', '$routeParams', 'Evento','$sce',
        function($scope, $http, $routeParams, Evento,$sce) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.evento = Evento.get({eventoId: $routeParams.eventoId}, function(evento) {
                $scope.imagem_secao = evento.imagemUrl;
                $scope.titulo_secao = evento.titulo;
                $scope.texto_secao = $sce.trustAsHtml(evento.texto);
                $scope.local_secao = evento.local;
                $scope.data_secao = evento.data;
            });

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos' || item == 'info'){
                    return 'appear';
                }
                return "";
            }
        }]);

eventoControllers.controller('AdicionarEventoCtrl',
    ['$scope','$http','$window','elementUpload',
        function($scope,$http,$window,elementUpload) {

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'|| item == 'info' || item=='preview'||item=='form_evento'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.info = {};

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;
                elementUpload.postElement($scope.info,'/api/eventos').success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/eventos");
                        $route.reload();
                    }
                );
            }

        }]);

projetoControllers.controller('EditarEventoCtrl',
    ['$scope','$http','$window','$location','$route','$routeParams','elementUpload','Evento',
        function($scope,$http,$window,$location,$route,$routeParams,elementUpload,Evento) {

            var eventoId = $routeParams.eventoId;

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos'|| item == 'info' || item=='preview'||item=='form_evento'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            Evento.get({eventoId: eventoId}, function(evento) {
                $scope.info = evento;
                $scope.srcimagem_elemento = evento.imagemUrl;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;
                elementUpload.updateElement($scope.info,'/api/eventos/'+eventoId).success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/eventos");
                        $route.reload();
                    }
                );
            }

        }]);
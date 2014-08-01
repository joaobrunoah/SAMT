/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var eventoControllers = angular.module('eventoControllers', []);

eventoControllers.controller('EventosCtrl',
    ['$scope','$http','$location','Evento','AuthenticationService','$route',
        function($scope,$http,$location,Evento,AuthenticationService,$route) {

            $scope.order_by = "data";

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
    ['$scope', '$http', '$routeParams', 'Evento','htmlCompiler',
        function($scope, $http, $routeParams, Evento,htmlCompiler) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.evento = Evento.get({eventoId: $routeParams.eventoId}, function(evento) {
                $scope.imagem_secao = evento.imagemUrl;
                $scope.titulo_secao = evento.titulo;
                $scope.texto_secao = htmlCompiler.compile(evento.texto);
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
    ['$scope','$http','$window','elementUpload','htmlCompiler',
        function($scope,$http,$window,elementUpload,htmlCompiler) {

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

            $scope.info = {
                titulo:"Escreva o Nome do Evento Aqui",
                texto:"Escreva o texto do Evento Aqui",
                resumo:"Escreva o resumo do Evento Aqui",
                local:"Escreva o local do Evento aqui"
            };

            $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
            $scope.$watch('info.texto',function(newValue,oldValue) {
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
            });

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
    ['$scope','$http','$window','$location','$route','$routeParams','elementUpload','Evento','htmlCompiler',
        function($scope,$http,$window,$location,$route,$routeParams,elementUpload,Evento,htmlCompiler) {

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
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                $scope.$watch('info.texto',function(newValue,oldValue) {
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                });
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
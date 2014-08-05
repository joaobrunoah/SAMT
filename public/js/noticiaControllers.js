/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var noticiaControllers = angular.module('noticiaControllers', []);

noticiaControllers.controller('NoticiasCtrl',
    ['$scope','$http','$location','Noticia','AuthenticationService','$route',
        function($scope,$http,$location,Noticia,AuthenticationService,$route) {

            $('#query_from').datetimepicker();
            $('#query_to').datetimepicker();

            $scope.orderby = {};
            $scope.orderby.options = [{name:'Mais Novas',value:'-data'},
                {name:'Mais Antigas',value:'data'}];

            $scope.query = {};
            $scope.query.orderby = $scope.orderby.options[0];

            $scope.query.limitTo = 1;

            $scope.entreDatas = function(elemento){
                var dataElemento = new Date(elemento.data);

                if ($scope.query.dataAntes != undefined && $scope.query.dataAntes != ''){
                    var dataAntes = new Date($scope.query.dataAntes);
                    if(dataAntes > dataElemento){
                        return false;
                    }
                }
                if ($scope.query.dataDepois != undefined && $scope.query.dataDepois != ''){
                    var dataDepois = new Date($scope.query.dataDepois);

                    if(dataDepois < dataElemento){
                        return false;
                    }
                }
                return true;
            };

            $scope.tipo_elemento = 'Notícias';

            var idElementSelected = null;

            $http.get('texts/texts.json').success(function(data) {
                $scope.titulo_secao = data.noticias;
            });

            $scope.results = Noticia.query(function(){
                var count = $scope.results.count;
                var limit = $scope.query.limitTo;
                var numPages = count/limit;
                $scope.offset = {};
                $scope.offset.options = [];
                for(var i = 0; i<numPages; i++){
                    $scope.offset.options.push({number:i+1});
                }
            });

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
    ['$scope', '$http', '$routeParams', 'Noticia','htmlCompiler',
        function($scope, $http, $routeParams, Noticia,htmlCompiler) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.noticia = Noticia.get({noticiaId: $routeParams.noticiaId}, function(noticia) {
                $scope.imagem_secao = noticia.imagemUrl;
                $scope.titulo_secao = noticia.titulo;
                $scope.data_secao = noticia.data;
                $scope.texto_secao = htmlCompiler.compile(noticia.texto);
            });

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'fotos' || item == 'data'){
                    return 'appear';
                }
                return "";
            }
        }]);

noticiaControllers.controller('AdicionarNoticiaCtrl',
    ['$scope','$http','$window','elementUpload','htmlCompiler',
        function($scope,$http,$window,elementUpload,htmlCompiler) {

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

            $scope.dataAtual = Date.now();

            $scope.info = {
                titulo:"Escreva o Nome da Notícia Aqui",
                texto:"Escreva o texto da Notícia Aqui",
                resumo:"Escreva o resumo da Notícia Aqui"
            };

            $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
            $scope.$watch('info.texto',function(newValue,oldValue) {
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
            });

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
    ['$scope','$http','$window','$location','$route','$routeParams','elementUpload','Noticia','htmlCompiler',
        function($scope,$http,$window,$location,$route,$routeParams,elementUpload,Noticia,htmlCompiler) {

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
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                $scope.$watch('info.texto',function(newValue,oldValue) {
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                });
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
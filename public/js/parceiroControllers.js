/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var parceiroControllers = angular.module('parceiroControllers', []);

parceiroControllers.controller('ParceirosCtrl',
    ['$scope','$interval','Parceiro','AuthenticationService','$route','$location',
        function($scope,$interval,Parceiro,AuthenticationService,$route,$location) {

            $scope.appearDialog = false;

            $scope.scrollPos = 0; // scroll position of each view

            $(window).on('scroll', function() {
                $scope.scrollPos = $(window).scrollTop();
                $scope.$apply();
            });

            var parceiros = Parceiro.query();
            $scope.parceirosArray=[];
            $interval(function(){
                var adicionarParceiro = {
                    imagemUrl: "img/site/adicionar.jpg",
                    nome: "Adicionar Parceiro",
                    url: "/#/parceiros/adicionar"
                };
                var parceirosTemp = [];
                var parceirosArrayTemp = [];
                var iMax = parceiros.length;
                if (iMax==0 && $scope.isLoggedIn()){
                    parceirosTemp.push(adicionarParceiro);
                    parceirosArrayTemp.push(parceirosTemp);
                } else {
                    for (var i = 0; i < iMax; i++) {
                        parceirosTemp.push(parceiros[i]);
                        if (i >= iMax - 1) {
                            if ($scope.isLoggedIn()) {
                                if (i % 3 == 2) {
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
                        } else if (i % 3 == 2) {
                            parceirosArrayTemp.push(parceirosTemp);
                            parceirosTemp = [];
                        }
                    }
                }
                $scope.parceirosArray=parceirosArrayTemp;
            },100,10);

            $scope.isLoggedIn = function() {
                return AuthenticationService.isLogged;
            };

            $scope.excluirParceiro = function(id) {
                var objToRemove = {};
                objToRemove.parceiroId = id;
                $scope.dialog_title = "Excluir Parceiro";
                $scope.dialog_text = "Tem certeza que deseja excluir este parceiro?";
                $scope.appearDialog = true;
                $('#dialog-confirm').dialog({
                    resizable: false,
                    height:200,
                    modal: true,
                    buttons: {
                        "Excluir": function() {
                            $( this ).dialog( "close" );
                            Parceiro.delete(objToRemove,function(){
                                $scope.parceiros = Parceiro.query();
                                $route.reload();
                            });
                        },
                        "Cancelar": function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            };

            $scope.editarParceiro = function(id) {
                $location.path("/parceiros/editar/" + id);
                $route.reload();
            }

            $scope.dialogAppear = function(){
                return $scope.appearDialog;
            }
        }]);

parceiroControllers.controller('AdicionarParceiroCtrl',
    ['$scope','$http','$window','$location','$route','elementUpload',
        function($scope,$http,$window,$location,$route,elementUpload) {

            $scope.mustAppear = function(subsecao){
                if(subsecao=='form_parceiro'){
                    return "appear";
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.info = {};

            $scope.sendInfo = function() {
                elementUpload.postElement($scope.info,'/api/parceiros').success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/parceiros");
                        $route.reload();
                    }
                ).error(function(err) {
                        console.log(err);
                    });

            }

        }]);

parceiroControllers.controller('EditarParceiroCtrl',
    ['$scope','$http','$window','$location','$route','$routeParams','elementUpload','Parceiro',
        function($scope,$http,$window,$location,$route,$routeParams,elementUpload,Parceiro) {

            var parceiroId = $routeParams.parceiroId;

            $scope.mustAppear = function(subsecao){
                if(subsecao=='form_parceiro'){
                    return "appear";
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            Parceiro.get({parceiroId: parceiroId}, function(parceiro) {
                $scope.info = parceiro;
                $scope.srcimagem = parceiro.imagemUrl;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.sendInfo = function() {
                elementUpload.updateElement($scope.info,'/api/parceiros/'+parceiroId).success(
                    function() {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/parceiros");
                        $route.reload();
                    }
                );

            }

        }]);
/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var projetoControllers = angular.module('projetoControllers', []);

projetoControllers.controller('ProjetosCtrl',
    ['$scope', '$http', '$interval', '$location', 'Projeto', 'AuthenticationService', '$route',
        function ($scope, $http, $interval, $location, Projeto, AuthenticationService, $route) {

            $scope.appearDialog = false;

            $scope.orderby = {};
            $scope.orderby.options = [
                {name: 'A -> Z', value: 'nome'},
                {name: 'Z -> A', value: '-nome'}
            ];

            $scope.query = {};
            $scope.query.orderby = $scope.orderby.options[0];

            $scope.query.limitTo = 1000;

            $scope.tipo_elemento = 'Projetos';
            $scope.tipo_url = 'projetos';

            var idElementSelected = null;

            $http.get('texts/texts.json').success(function (data) {
                $scope.titulo_secao = data.projetos;
            });

            $scope.elementos = Projeto.query();

            var mudarNomeParaTitulo = $interval(function () {
                var i = 0;
                for (i = 0; i < $scope.elementos.length; i++) {
                    $scope.elementos[i].titulo = $scope.elementos[i].nome;
                }
                if (i != 0) {
                    $interval.cancel(mudarNomeParaTitulo);
                }
            }, 200, 20);

            $scope.isElementSelected = function (id) {

                if (id == idElementSelected) {
                    return "selected";
                }
                return "";
            };

            $scope.selectElement = function (id) {
                if (!$scope.isLoggedIn()) {
                    idElementSelected = id;
                }
            };

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            };

            $scope.excluirElemento = function (id) {
                var objToRemove = {};
                objToRemove.projetoId = id;
                $scope.dialog_title = "Excluir Projeto";
                $scope.dialog_text = "Tem certeza que deseja excluir este projeto?";
                $scope.appearDialog = true;
                $('#dialog-confirm').dialog({
                    resizable: false,
                    height: 200,
                    modal: true,
                    buttons: {
                        "Excluir": function () {
                            $(this).dialog("close");
                            Projeto.delete(objToRemove, function () {
                                $scope.elementos = Projeto.query();
                                $route.reload();
                            });
                        },
                        "Cancelar": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            };

            $scope.editarElemento = function (id) {
                $location.path("/projetos/editar/" + id);
                $route.reload();
            }

            $scope.dialogAppear = function () {
                return $scope.appearDialog;
            }

        }]);

projetoControllers.controller('SecaoProjetoCtrl',
    ['$scope', '$http', '$routeParams', 'Projeto', 'htmlCompiler', 'galeriaFotos',
        function ($scope, $http, $routeParams, Projeto, htmlCompiler, galeriaFotos) {
            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            $scope.projeto = Projeto.get({projetoId: $routeParams.projetoId}, function (projeto) {
                $scope.imagem_secao = projeto.imagemUrl;
                $scope.titulo_secao = projeto.nome;
                $scope.texto_secao = htmlCompiler.compile(projeto.texto);
                $scope.distance_top = projeto.distanceTop;
                $scope.cursos_secao = projeto.cursos;
                $scope.galeria_fotos = projeto.fotos;
                if ($scope.galeria_fotos == undefined) {
                    $scope.galeria_fotos = [];
                }
                for (var i = 0; i < $scope.galeria_fotos.length; i++) {
                    $scope.galeria_fotos[i].appearName = !($scope.galeria_fotos[i].nome == "" || $scope.galeria_fotos[i].nome == undefined);
                }
                $scope.galeria_fotos = galeriaFotos.transformarMatriz($scope.galeria_fotos);
            });

            $scope.mustAppear = function (item) {
                if (item == 'texto') {
                    return 'appear';
                } else if (item == 'fotos' && $scope.galeria_fotos != [] && $scope.galeria_fotos != '' && $scope.galeria_fotos != undefined) {
                    return 'appear';
                } else if (item == 'agenda' && $scope.cursos_secao != [] && $scope.cursos_secao != '' && $scope.cursos_secao != undefined) {
                    return 'appear';
                }
                return "";
            }

            $scope.passouData = function (elemento) {
                var dataElemento = new Date(elemento.data);
                if (dataElemento <= Date.now()) {
                    return false;
                }
                return true;
            }

        }]);

projetoControllers.controller('AdicionarProjetoCtrl',
    ['$scope', '$http', '$window', 'elementUpload', 'htmlCompiler', '$location',
        function ($scope, $http, $window, elementUpload, htmlCompiler, $location) {

            $scope.mustAppear = function (item) {
                if (item == 'texto' || item == 'preview' || item == 'form_projeto') {
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.info = {};

            $scope.$watch('info.texto', function (newValue, oldValue) {
                if ($scope.info.texto != undefined) {
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                }
            });

            $scope.sendInfo = function () {
                $scope.info.image = $scope.info.image_elemento;
                $scope.info.nome = $scope.info.titulo;
                elementUpload.postElement($scope.info, '/api/projetos').success(
                    function () {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/projetos");
                        $route.reload();
                    }
                );
            };

        }]);

projetoControllers.controller('EditarProjetoCtrl',
    ['$scope', '$http', '$location', '$route', '$routeParams', 'elementUpload', 'Projeto', 'htmlCompiler', '$interval', 'galeriaFotos', 'AuthenticationService',
        function ($scope, $http, $location, $route, $routeParams, elementUpload, Projeto, htmlCompiler, $interval, galeriaFotos, AuthenticationService) {

            var projetoId = $routeParams.projetoId;

            $interval(function () {
                $('.curso_data').datetimepicker();
            }, 100, 5);

            $scope.mustAppear = function (item) {
                if (item == 'texto' || item == 'fotos' || item == 'preview' || item == 'form_projeto' || item == 'agenda') {
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            Projeto.get({projetoId: projetoId}, function (projeto) {
                $scope.info = projeto;
                $scope.info.titulo = projeto.nome;
                $scope.srcimagem_elemento = projeto.imagemUrl;
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                $scope.$watch('info.texto', function (newValue, oldValue) {
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                });
                $scope.info.cursos = projeto.cursos;
                if ($scope.info.cursos == undefined) {
                    $scope.info.cursos = [];
                }
                $scope.info.fotos = projeto.fotos;
                if ($scope.info.fotos == undefined) {
                    $scope.info.fotos = [];
                }
                $scope.info.fotosMatriz = galeriaFotos.transformarMatriz($scope.info.fotos);
            });

            $scope.sendInfo = function () {

                if ($scope.info.texto == undefined) {
                    $scope.info.texto = "";
                }

                if ($scope.info.resumo == undefined) {
                    $scope.info.resumo = "";
                }

                $scope.info.image = $scope.info.image_elemento;
                $scope.info.nome = $scope.info.titulo;
                $scope.info.fotos = galeriaFotos.transformarArray($scope.info.fotosMatriz);
                $scope.info.fotos = galeriaFotos.tratarNomeArquivos($scope.info.fotos, 'projetos', projetoId);
                elementUpload.updateElement($scope.info, '/api/projetos/' + projetoId).success(
                    function () {
                        $http.put('/api/projetos/inserirarrays/' + projetoId, {cursos: $scope.info.cursos, fotos: $scope.info.fotos}).success(
                            function () {
                                alert("Conteúdo Enviado com Sucesso");
                                $location.path("/projetos");
                                $route.reload();
                            });
                    }).error(function (err) {
                        alert(err.message);
                    });
            };

            $scope.inserirCurso = function () {
                $scope.info.cursos.push({data: '', bairro: '', local: ''});
                $interval(function () {
                    $('.curso_data').datetimepicker();
                }, 100, 5);
            };

            $scope.addFoto = function () {
                $scope.info.fotos = galeriaFotos.transformarArray($scope.info.fotosMatriz);
                $scope.info.fotos.push({imagemUrl: '', nome: ''});
                $scope.info.fotosMatriz = galeriaFotos.transformarMatriz($scope.info.fotos);
            };

            $scope.postImage = function (elemento) {
                var image = elemento.files[0];

                elementUpload.uploadFoto(image, 'projetos', projetoId);
            }

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            }

            $scope.deleteFoto = function (foto) {
                var index = $scope.info.fotos.indexOf(foto);
                $scope.info.fotos.splice(index, 1);
                $scope.info.fotosMatriz = galeriaFotos.transformarMatriz($scope.info.fotos);
                var nomeFoto = galeriaFotos.getNomeFoto(foto);

                elementUpload.deleteFoto(nomeFoto, 'projetos', projetoId);
            }

        }]);
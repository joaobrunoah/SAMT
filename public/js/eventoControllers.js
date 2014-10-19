/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var eventoControllers = angular.module('eventoControllers', []);

/* Common functions */

var filtroEntreDatas = function (elemento, query) {
    var dataElemento = new Date(elemento.data);

    if (query.dataAntes != undefined && query.dataAntes != '') {
        var dataAntes = new Date(query.dataAntes);
        if (dataAntes > dataElemento) {
            return false;
        }
    }
    if (query.dataDepois != undefined && query.dataDepois != '') {
        var dataDepois = new Date(query.dataDepois);

        if (dataDepois < dataElemento) {
            return false;
        }
    }
    return true;
};

eventoControllers.controller('EventosCtrl',
    ['$scope', '$http', '$location', 'Evento', 'AuthenticationService', '$route',
        function ($scope, $http, $location, Evento, AuthenticationService, $route) {

            $('#query_from').datetimepicker();
            $('#query_to').datetimepicker();

            $scope.appearDialog = false;

            $scope.orderby = {};
            $scope.orderby.options = [
                {name: 'Mais Novas', value: '-data'},
                {name: 'Mais Antigas', value: 'data'}
            ];

            $scope.query = {};
            $scope.query.orderby = $scope.orderby.options[0];

            $scope.query.limitTo = 10;

            $scope.offset = {};
            $scope.offset.options = [
                {number: 1}
            ];
            $scope.query.offset = $scope.offset.options[0];

            $scope.tipo_elemento = 'Eventos';
            $scope.tipo_url = 'eventos';

            var idElementSelected = null;

            /* QUERIES TO GET DATA */

            $http.get('texts/texts.json').success(function (data) {
                $scope.titulo_secao = data.eventos;
            });

            $scope.results = Evento.query(function () {
                var count = $scope.results.count;
                var limit = $scope.query.limitTo;
                var numPages = count / limit;
                $scope.offset = {};
                $scope.offset.options = [];
                $scope.elementos = $scope.results.elementos;
                for (var i = 0; i < numPages; i++) {
                    $scope.offset.options.push({number: i + 1});
                }
                if($scope.elementos != undefined && $scope.isLoggedIn()) {
                    for (var j = 0; j < $scope.elementos.length; j++){
                        if($scope.elementos[j].titulo.length > 40)
                            $scope.elementos[j].titulo = $scope.elementos[j].titulo.substring(0,39) + "...";
                    }
                }
                $scope.query.offset = $scope.offset.options[0];
            });

            /* UI FUNCTIONS */

            $scope.isElementSelected = function (id) {
                if (id == idElementSelected) {
                    return "selected";
                }
                return "";
            };

            $scope.selectElement = function (id) {
                idElementSelected = id;
            };

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            };

            $scope.excluirElemento = function (id) {
                var objToRemove = {};
                objToRemove.eventoId = id;
                $scope.dialog_title = "Excluir Evento";
                $scope.dialog_text = "Tem certeza que deseja excluir este evento?";
                $scope.appearDialog = true;
                $('#dialog-confirm').dialog({
                    resizable: false,
                    height: 200,
                    modal: true,
                    buttons: {
                        "Excluir": function () {
                            $(this).dialog("close");
                            Evento.delete(objToRemove, function () {
                                $scope.elementos = Evento.query();
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
                $location.path("/eventos/editar/" + id);
                $route.reload();
            };

            $scope.deAcordoQuery = function (elemento) {
                var count = $scope.results.count;
                var limit = $scope.query.limitTo;
                var elementoIndex = getElementPosition(elemento);
                var offset = $scope.query.offset.number;
                var reverse = $scope.query.orderby.value == "-data";

                var filtroDatas = filtroEntreDatas(elemento, $scope.query);

                var filtroOffset = ((elementoIndex >= (offset - 1) * limit) && !reverse) ||
                    ((elementoIndex < count - ((offset - 1) * limit)) && reverse);
                return filtroDatas && filtroOffset;
            };

            var getElementPosition = function (elemento) {
                var elementos = $scope.results.elementos;
                for (var i = 0; i < elementos.length; i++) {
                    if (elemento._id == elementos[i]._id) {
                        return i;
                    }
                }
            }

            $scope.dialogAppear = function () {
                return $scope.appearDialog;
            }

        }]);

eventoControllers.controller('SecaoEventoCtrl',
    ['$scope', '$http', '$routeParams', 'Evento', 'htmlCompiler', 'galeriaFotos',
        function ($scope, $http, $routeParams, Evento, htmlCompiler, galeriaFotos) {

            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            $scope.evento = Evento.get({eventoId: $routeParams.eventoId}, function (evento) {
                $scope.imagem_secao = evento.imagemUrl;
                $scope.titulo_secao = evento.titulo;
                $scope.texto_secao = htmlCompiler.compile(evento.texto);
                $scope.local_secao = evento.local;
                $scope.data_secao = evento.data;
                $scope.distance_top = evento.distanceTop;
                $scope.galeria_fotos = evento.fotos;
                if ($scope.galeria_fotos == undefined) {
                    $scope.galeria_fotos = [];
                }
                for (var i = 0; i < $scope.galeria_fotos.length; i++) {
                    $scope.galeria_fotos[i].appearName = !($scope.galeria_fotos[i].nome == "" || $scope.galeria_fotos[i].nome == undefined);
                }
                $scope.galeria_fotos = galeriaFotos.transformarMatriz($scope.galeria_fotos);
            });

            $scope.mustAppear = function (item) {
                if (item == 'texto' || item == 'info') {
                    return 'appear';
                } else if (item == 'fotos' && $scope.galeria_fotos != [] && $scope.galeria_fotos != '' && $scope.galeria_fotos != undefined) {
                    return 'appear';
                }
                return "";
            }
        }]);

eventoControllers.controller('AdicionarEventoCtrl',
    ['$scope', '$http', '$window', 'elementUpload', 'htmlCompiler', '$location',
        function ($scope, $http, $window, elementUpload, htmlCompiler, $location) {

            $('#data').datetimepicker();

            $scope.mustAppear = function (item) {
                if (item == 'texto' || item == 'info' || item == 'preview' || item == 'form_evento') {
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
                elementUpload.postElement($scope.info, '/api/eventos').success(
                    function () {
                        alert("Conteúdo Enviado com Sucesso");
                        $location.path("/eventos");
                        $route.reload();
                    }
                );
            }

        }]);

projetoControllers.controller('EditarEventoCtrl',
    ['$scope', '$http', '$location', '$route', '$routeParams', 'elementUpload', 'Evento', 'htmlCompiler', 'galeriaFotos', 'AuthenticationService',
        function ($scope, $http, $location, $route, $routeParams, elementUpload, Evento, htmlCompiler, galeriaFotos, AuthenticationService) {

            $('#data').datetimepicker();

            var eventoId = $routeParams.eventoId;

            $scope.mustAppear = function (item) {
                if (item == 'texto' || item == 'fotos' || item == 'info' || item == 'preview' || item == 'form_evento') {
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            Evento.get({eventoId: eventoId}, function (evento) {
                $scope.info = evento;
                $scope.srcimagem_elemento = evento.imagemUrl;
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                $scope.$watch('info.texto', function (newValue, oldValue) {
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                });
            });

            $scope.sendInfo = function () {
                if ($scope.info.texto == undefined) {
                    $scope.info.texto = "";
                }

                if ($scope.info.resumo == undefined) {
                    $scope.info.resumo = "";
                }

                $scope.info.image = $scope.info.image_elemento;

                $scope.info.fotos = galeriaFotos.transformarArray($scope.info.fotosMatriz);
                $scope.info.fotos = galeriaFotos.tratarNomeArquivos($scope.info.fotos, 'eventos', eventoId);
                elementUpload.updateElement($scope.info, '/api/eventos/' + eventoId).success(
                    function () {
                        $http.put('/api/eventos/inserirarrays/' + eventoId, {fotos: $scope.info.fotos}).success(
                            function () {
                                alert("Conteúdo Enviado com Sucesso");
                                $location.path("/eventos");
                                $route.reload();
                            });
                    }).error(function (err) {
                        alert(err.message);
                    });

            };

            $scope.addFoto = function () {
                $scope.info.fotos = galeriaFotos.transformarArray($scope.info.fotosMatriz);
                $scope.info.fotos.push({imagemUrl: '', nome: ''});
                $scope.info.fotosMatriz = galeriaFotos.transformarMatriz($scope.info.fotos);
            };

            $scope.postImage = function (elemento) {
                var image = elemento.files[0];
                elementUpload.uploadFoto(image, 'eventos', eventoId);
            };

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            }

            $scope.deleteFoto = function (foto) {
                elementUpload.deleteFoto(foto, 'eventos', eventoId).success(function () {
                    $route.reload();
                });
            }

        }]);
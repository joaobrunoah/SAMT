/**
 * Created by João on 8/1/2014.
 */

'use strict';

/* Controllers */

var noticiaControllers = angular.module('noticiaControllers', []);

/* Common functions */

var filtroEntreDatas = function(elemento,query){
    var dataElemento = new Date(elemento.data);

    if (query.dataAntes != undefined && query.dataAntes != ''){
        var dataAntes = new Date(query.dataAntes);
        if(dataAntes > dataElemento){
            return false;
        }
    }
    if (query.dataDepois != undefined && query.dataDepois != ''){
        var dataDepois = new Date(query.dataDepois);

        if(dataDepois < dataElemento){
            return false;
        }
    }
    return true;
};

noticiaControllers.controller('NoticiasCtrl',
    ['$scope','$http','$location','Noticia','AuthenticationService','$route',
        function($scope,$http,$location,Noticia,AuthenticationService,$route) {

            $('#query_from').datetimepicker();
            $('#query_to').datetimepicker();

            $scope.appearDialog = false;

            $scope.orderby = {};
            $scope.orderby.options = [{name:'Mais Novas',value:'-data'},
                {name:'Mais Antigas',value:'data'}];

            $scope.query = {};
            $scope.query.orderby = $scope.orderby.options[0];

            $scope.query.limitTo = 10;

            $scope.offset = {};
            $scope.offset.options = [{number:1}];
            $scope.query.offset = $scope.offset.options[0];

            $scope.tipo_elemento = 'Notícias';
            $scope.tipo_url = 'noticias';

            var idElementSelected = null;

            /* QUERIES TO GET DATA */

            $http.get('texts/texts.json').success(function(data) {
                $scope.titulo_secao = data.noticias;
                $scope.data_postado = data.data_postado;
            });

            $scope.results = Noticia.query(function(){
                var count = $scope.results.count;
                var limit = $scope.query.limitTo;
                var numPages = count/limit;
                $scope.offset = {};
                $scope.offset.options = [];
                $scope.elementos = $scope.results.elementos;
                for(var i = 0; i<numPages; i++){
                    $scope.offset.options.push({number:i+1});
                }
                $scope.query.offset = $scope.offset.options[0];
            });

            /* UI FUNCTIONS */

            $scope.isElementSelected = function(id) {
                if(id == idElementSelected){
                    return "selected";
                }
                return "";
            };

            $scope.selectElement = function(id) {
                idElementSelected = id;
            };

            $scope.isLoggedIn = function() {
                return AuthenticationService.isLogged;
            };

            $scope.excluirElemento = function(id) {
                var objToRemove = {};
                objToRemove.noticiaId = id;
                $scope.dialog_title = "Excluir Notícia";
                $scope.dialog_text = "Tem certeza que deseja excluir esta notícia?";
                $scope.appearDialog = true;
                $('#dialog-confirm').dialog({
                    resizable: false,
                    height:200,
                    modal: true,
                    buttons: {
                        "Excluir": function() {
                            $( this ).dialog( "close" );
                            Noticia.delete(objToRemove,function(){
                                $scope.elementos = Noticia.query();
                                $route.reload();
                            });
                        },
                        "Cancelar": function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            };

            $scope.editarElemento = function(id) {
                $location.path("/noticias/editar/" + id);
                $route.reload();
            };

            $scope.deAcordoQuery = function(elemento){
                var count = $scope.results.count;
                var limit = $scope.query.limitTo;
                var elementoIndex = getElementPosition(elemento);
                var offset = $scope.query.offset.number;
                var reverse = $scope.query.orderby.value == "-data";

                var filtroDatas = filtroEntreDatas(elemento,$scope.query);

                var filtroOffset = ((elementoIndex >= (offset - 1)*limit)&&!reverse)||
                    ((elementoIndex < count-((offset-1)*limit))&&reverse);
                return filtroDatas && filtroOffset;
            };

            var getElementPosition = function(elemento){
                var elementos = $scope.results.elementos;
                for (var i=0;i<elementos.length;i++){
                    if(elemento._id == elementos[i]._id){
                        return i;
                    }
                }
            }

            $scope.dialogAppear = function(){
                return $scope.appearDialog;
            }

        }]);

noticiaControllers.controller('SecaoNoticiaCtrl',
    ['$scope', '$http', '$routeParams', 'Noticia','htmlCompiler','galeriaFotos',
        function($scope, $http, $routeParams, Noticia,htmlCompiler,galeriaFotos) {

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.elemento = Noticia.get({noticiaId: $routeParams.noticiaId}, function(noticia) {
                $scope.imagem_secao = noticia.imagemUrl;
                $scope.titulo_secao = noticia.titulo;
                $scope.data_secao = noticia.data;
                $scope.texto_secao = htmlCompiler.compile(noticia.texto);
                $scope.distance_top = noticia.distanceTop;
                $scope.galeria_fotos = noticia.fotos;
                if($scope.galeria_fotos == undefined){
                    $scope.galeria_fotos = [];
                }
                for(var i = 0; i<$scope.galeria_fotos.length; i++){
                    $scope.galeria_fotos[i].appearName = !($scope.galeria_fotos[i].nome == "" || $scope.galeria_fotos[i].nome == undefined);
                }
                $scope.galeria_fotos = galeriaFotos.transformarMatriz($scope.galeria_fotos);
            });

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'data'){
                    return 'appear';
                } else if(item=='fotos' && $scope.galeria_fotos != [] && $scope.galeria_fotos != '' && $scope.galeria_fotos != undefined){
                    return 'appear';
                }
                return "";
            }
        }]);

noticiaControllers.controller('AdicionarNoticiaCtrl',
    ['$scope','$http','$location','$window','elementUpload','htmlCompiler',
        function($scope,$http,$location,$window,elementUpload,htmlCompiler) {

            $scope.mustAppear = function(item){
                if(item == 'texto'|| item == 'data' || item=='preview'||item=='form_noticia'){
                    return 'appear';
                }
                return "";
            };

            $http.get('texts/texts.json').success(function(data) {
                $scope.texts = data;
            });

            $scope.token = $window.localStorage.samtToken;

            $scope.dataAtual = Date.now();

            $scope.info = {};

            $scope.$watch('info.texto',function(newValue,oldValue) {
                if($scope.info.texto != undefined){
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                }
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
    ['$scope','$http','$location','$route','$routeParams','elementUpload','Noticia','htmlCompiler','galeriaFotos','AuthenticationService',
        function($scope,$http,$location,$route,$routeParams,elementUpload,Noticia,htmlCompiler,galeriaFotos,AuthenticationService) {

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
                $scope.info = elemento;
                $scope.srcimagem_elemento = elemento.imagemUrl;
                $scope.dataAtual = elemento.data;
                $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                $scope.$watch('info.texto',function(newValue,oldValue) {
                    $scope.info.texto_html = htmlCompiler.compile($scope.info.texto);
                });
            });

            $scope.sendInfo = function() {
                $scope.info.image = $scope.info.image_elemento;

                $scope.info.fotos = galeriaFotos.transformarArray($scope.info.fotosMatriz);
                $scope.info.fotos = galeriaFotos.tratarNomeArquivos($scope.info.fotos,'noticias',projetoId);
                elementUpload.updateElement($scope.info,'/api/noticias/'+noticiaId).success(
                    function() {
                        $http.put('/api/noticias/inserirarrays/'+noticiaId,{fotos:$scope.info.fotos}).success(
                            function(){
                                alert("Conteúdo Enviado com Sucesso");
                                $location.path("/noticias");
                                $route.reload();
                            });
                    });

            };

            $scope.addFoto = function(){
                $scope.info.fotos = galeriaFotos.transformarArray($scope.info.fotosMatriz);
                $scope.info.fotos.push({imagemUrl:'',nome:''});
                $scope.info.fotosMatriz = galeriaFotos.transformarMatriz($scope.info.fotos);
            };

            $scope.postImage = function(elemento){
                var image = elemento.files[0];
                elementUpload.uploadFoto(image,'projetos',projetoId);
            }

            $scope.isLoggedIn = function() {
                return AuthenticationService.isLogged;
            }

            $scope.deleteFoto = function(foto){
                elementUpload.deleteFoto(foto,'projetos',projetoId).success(function(){$route.reload();});
            }

        }]);
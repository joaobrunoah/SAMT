'use strict';

/* Controllers */

var samtControllers = angular.module('samtControllers', []);

samtControllers.controller('TopNavCtrl',
    ['$scope', '$location', 'AuthenticationService', '$window', '$http',
        function ($scope, $location, AuthenticationService, $window, $http) {

            $http.get('texts/texts.json').success(function (data) {
                // you can do some processing here
                $scope.texts = data;
            });

            $scope.getClass = function (path) {
                if ($location.path().substr(0, path.length) == path) {
                    return "active"
                } else {
                    return ""
                }
            }

            $scope.logoutAppear = function () {
                if (!AuthenticationService.isLogged && $window.localStorage.samtToken
                    && $window.localStorage.expirationDate >= Date.now()) {
                    AuthenticationService.isLogged = true;
                    return "appear";
                }
                if (AuthenticationService.isLogged) {
                    return "appear";
                }
                return "";
            }

            $scope.userLogout = function () {
                if (AuthenticationService.isLogged) {
                    AuthenticationService.isLogged = false;
                    delete $window.localStorage.samtToken;
                    delete $window.localStorage.expirationDate;
                }
            }

        }]);

samtControllers.controller('InicioCtrl',
    ['$scope', '$http', '$interval', 'Noticia', 'Projeto', 'Evento',
        function ($scope, $http, $interval, Noticia, Projeto, Evento) {

            var numberOfElements = 0;

            $scope.abaNoticia = true;
            $scope.abaEvento = false;

            $scope.elementosCounter = 0;

            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            $scope.noticias = {};

            $scope.eventos = {};

            // Elemento escolhido nas abas!
            $scope.elementos = {};

            $scope.noticiaQuery = Noticia.query(function () {
                $scope.noticias = $scope.noticiaQuery.elementos;
                $scope.elementos = $scope.noticias;
                numberOfElements = $scope.elementos.length;
                $scope.setElementoMaisNovoActive();
            });

            $scope.eventoQuery = Evento.query(function () {
                $scope.eventos = $scope.eventoQuery.elementos;
            });

            $scope.projetos = Projeto.query(function () {
                var menorRand = 1;
                var selectedProject = 0;
                for (var i = 0; i < $scope.projetos.length; i++) {
                    $scope.projetos[i].random = Math.random();
                    if ($scope.projetos[i].random < menorRand) {
                        menorRand = $scope.projetos[i].random;
                        selectedProject = i;
                    }
                }
                $scope.activeProjeto = $scope.projetos[selectedProject]._id;
            });
            $scope.ordenarPor = '-data';

            /* FUNCOES DE NOTICIA E EVENTO */

            $scope.selectAba = function (aba) {
                if (aba == 'noticia') {
                    $scope.abaNoticia = true;
                    $scope.abaEvento = false;
                    $scope.elementos = $scope.noticias;
                } else if (aba == 'evento') {
                    $scope.abaNoticia = false;
                    $scope.abaEvento = true;
                    $scope.elementos = $scope.eventos;
                } else {
                    $scope.abaNoticia = true;
                    $scope.abaEvento = false;
                    $scope.elementos = $scope.noticias;

                }
                numberOfElements = $scope.elementos.length;
                $scope.setElementoMaisNovoActive();
            };

            $scope.isElementoActive = function (idElemento) {
                if (idElemento == $scope.activeElemento) {
                    return "active";
                } else {
                    return "";
                }
            };

            $scope.setElementoMaisNovoActive = function () {
                var elementoMaisNovoData = 0;
                for (var i = 0; i < $scope.elementos.length; i++) {
                    var dataElemento = new Date($scope.elementos[i].data);
                    if (dataElemento > elementoMaisNovoData) {
                        elementoMaisNovoData = dataElemento;
                        $scope.activeElemento = $scope.elementos[i]._id;
                    }
                }
                $scope.elementosCounter = numberOfElements - 1;
            };

            $scope.setElementoActive = function (idElemento) {
                $scope.activeElemento = idElemento;
                $scope.elementosCounter = idElemento - 1;
                $interval.cancel($scope.iterateOverElementos);
                $scope.iterateOverElementos = $interval(function () {
                    $scope.elementosCounter += 1;
                    if ($scope.elementosCounter >= $scope.elementos.length) {
                        $scope.elementosCounter = 0;
                    }
                    $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;
                    $interval.cancel($scope.iterateOverElementos);
                    $scope.iterateOverElementos = $interval(function () {
                        $scope.elementosCounter += 1;
                        if ($scope.elementosCounter >= $scope.elementos.length) {
                            $scope.elementosCounter = 0;
                        }
                        $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;

                    }, 5000);
                }, 20000);
            }

            $scope.getElemento = function () {
                for (var i = 0; i < $scope.elementos.length; i++) {
                    if ($scope.elementos[i]._id == $scope.activeElemento) {
                        return $scope.elementos[i];
                    }
                }
                return null;
            }

            $scope.iterateOverElementos = $interval(function () {
                $scope.elementosCounter -= 1;
                if ($scope.elementosCounter < 0) {
                    $scope.elementosCounter = numberOfElements - 1;
                }
                $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;
            }, 5000);

            /* toRight = 1 => right */
            $scope.iterateElementos = function (toRight) {
                $interval.cancel($scope.iterateOverElementos);
                if (toRight == 1) {
                    $scope.elementosCounter -= 1;
                    if ($scope.elementosCounter < 0) {
                        $scope.elementosCounter = numberOfElements - 1;
                    }
                    $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;
                } else {
                    $scope.elementosCounter += 1;
                    if ($scope.elementosCounter >= numberOfElements) {
                        $scope.elementosCounter = 0;
                    }
                    $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;
                }

                $scope.iterateOverElementos = $interval(function () {

                    $scope.elementosCounter -= 1;
                    if ($scope.elementosCounter < 0) {
                        $scope.elementosCounter = numberOfElements - 1;
                    }
                    $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;

                    $interval.cancel($scope.iterateOverElementos);
                    $scope.iterateOverElementos = $interval(function () {
                        $scope.elementosCounter -= 1;
                        if ($scope.elementosCounter < 0) {
                            $scope.elementosCounter = numberOfElements - 1;
                        }
                        $scope.activeElemento = $scope.elementos[$scope.elementosCounter]._id;

                    }, 5000);
                }, 20000);
            };

            /* FIM DE FUNCOES DE NOTICIA E EVENTO*/

            /* FUNCOES DE PROJETO */

            $scope.isProjectActive = function (idProjeto) {
                if (idProjeto == $scope.activeProjeto) {
                    return "active";
                } else {
                    return "";
                }
            }

            $scope.setProjectActive = function (idProjeto) {
                $scope.activeProjeto = idProjeto;
            }

            $scope.isLast = function ($last, $first) {
                if ($last && !$first) {
                    return 'last';
                }
                return '';
            }

            $scope.isMiddle = function ($middle, $first) {
                if ($middle && !$first) {
                    return 'middle';
                }
                return '';
            }

            /* FIM DE FUNCOES DE PROJETO */

        }]);

samtControllers.controller('QuemSomosCtrl',
    ['$scope', '$http', '$sce', 'AuthenticationService',
        function ($scope, $http, $sce, AuthenticationService) {

            $http.get('texts/texts.json').success(function (data) {
                $scope.titulo_secao = data.quem_somos;
                $scope.texto_secao = $sce.trustAsHtml(data.quem_somos_text);
                $scope.imagem_secao = data.quem_somos_imagem;
                $scope.distance_top = data.quem_somos_distance_top;
            });

            $scope.mustAppear = function (subsecao) {
                if (subsecao == 'texto') {
                    return "appear";
                }
                return "";
            }

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            }
        }]);

samtControllers.controller('AdminCtrl',
    ['$scope', '$http', '$window', '$location', 'AuthenticationService', 'UserService', '$route',
        function ($scope, $http, $window, $location, AuthenticationService, UserService, $route) {

            $http.get('texts/texts.json').success(function (data) {
                $scope.texts = data;
            });

            //Admin User Controller (login, logout)
            $scope.Login = function (credentials) {
                var username = credentials.username;
                var password = credentials.password;
                if (username !== undefined && password !== undefined) {
                    UserService.Login(username, password).success(function (data) {
                        AuthenticationService.isLogged = true;
                        $window.localStorage.samtToken = data.samtToken;
                        $http.defaults.headers.common['x-access-token'] = $window.localStorage.samtToken;
                        $window.localStorage.expirationDate = data.expires;
                        $window.localStorage.usuario = username;
                        $location.path("/");
                        $route.reload();
                    }).error(function (status, data) {
                        alert(status);
                        //console.log(data);
                    });
                }
            };

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            };

            $scope.passInfo = {};
            $scope.passInfo.confirmacao = '';

            $scope.userInfo = {};
            $scope.userInfo.confirmacao = '';

            $scope.mudarSenha = function (passInfo) {
                if (passInfo.senhaNova != passInfo.confirmacao) {
                    return;
                }
                UserService.MudarSenha(passInfo.senhaAntiga, passInfo.senhaNova, $window.localStorage.usuario).success(function (data, status) {
                    alert(data);
                }).error(function (data, status) {
                    alert(data);
                });
            };

            $scope.adicionarUsuario = function (userInfo) {
                if (userInfo.senha != userInfo.confirmacao) {
                    return;
                }
                UserService.AdicionarUsuario(userInfo.usuario, userInfo.senha).success(function (data, status) {
                    alert(data);
                }).error(function (data, status) {
                    alert(data);
                });
            };
        }]);

samtControllers.controller('TrabalheCtrl',
    ['$scope', '$http', '$sce', 'AuthenticationService',
        function ($scope, $http, $sce, AuthenticationService) {

            $http.get('texts/texts.json').success(function (data) {
                $scope.titulo_secao = data.trabalhe_conosco;
                $scope.texto_secao = $sce.trustAsHtml(data.trabalhe_text);
                $scope.imagem_secao = data.trabalhe_imagem;
                $scope.distance_top = data.trabalhe_distance_top;
            });

            $scope.mustAppear = function (subsecao) {
                if (subsecao == 'texto') {
                    return "appear";
                }
                return "";
            }

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            }
        }]);

samtControllers.controller('ContatoCtrl',
    ['$scope', '$http', '$sce', 'AuthenticationService',
        function ($scope, $http, $sce, AuthenticationService) {

            $http.get('texts/texts.json').success(function (data) {
                $scope.titulo_secao = data.contato;
                $scope.texto_secao = $sce.trustAsHtml(data.contato_text);
                $scope.imagem_secao = data.contato_imagem;
                $scope.distance_top = data.contato_distance_top;
            });

            $scope.mustAppear = function (subsecao) {
                if (subsecao == 'texto') {
                    return "appear";
                }
                return "";
            }

            $scope.isLoggedIn = function () {
                return AuthenticationService.isLogged;
            }
        }]);

//samtControllers.controller('LojaCtrl',
//    ['$scope','$http','$sce','AuthenticationService',
//        function($scope,$http,$sce,AuthenticationService) {
//
//            $http.get('texts/texts.json').success(function(data) {
//                $scope.titulo_secao = data.loja;
//                $scope.texto_secao = $sce.trustAsHtml(data.loja_text);
//                $scope.imagem_secao = data.loja_imagem;
//                $scope.distance_top = data.loja_distance_top;
//            });
//
//            $http.get('/api/loja').success(function(lojas){
//                if (lojas) {
//                    var loja = lojas[0];
//                    $scope.galeria_fotos = loja.produtos;
//                    if ($scope.galeria_fotos == undefined) {
//                        $scope.galeria_fotos = [];
//                    }
//                    $scope.galeria_fotos = galeriaFotos.transformarMatriz($scope.galeria_fotos);
//                }
//            });
//
//            $scope.mustAppear = function(subsecao) {
//                if(subsecao == 'texto' || subsecao == 'fotos'){
//                    return "appear";
//                }
//                return "";
//            }
//
//            $scope.isLoggedIn = function() {
//                return AuthenticationService.isLogged;
//            }
//
//            $scope.inserirProdutos = function(){
//                if($scope.isLoggedin()){
//                    return "appear";
//                }
//                return "";
//            }
//        }]);
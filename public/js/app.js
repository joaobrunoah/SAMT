'use strict';

/* App Module */

var samtApp = angular.module('samtApp',
    [
        'ngRoute',
        'samtAnimations',
        'samtControllers',
        'parceiroControllers',
        'projetoControllers',
        'noticiaControllers',
        'eventoControllers',
        'samtFilters',
        'samtServices',
        'samtDirectives',
        'ngSanitize'
    ]);

samtApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/inicio', {
            templateUrl: 'partials/inicio.html',
            controller: 'InicioCtrl'
        }).
        when('/quem_somos', {
            templateUrl: 'partials/template_secao.html',
            controller: 'QuemSomosCtrl'
        }).
        when('/parceiros', {
            templateUrl: 'partials/parceiros.html',
            controller: 'ParceirosCtrl'
        }).
        when('/parceiros/adicionar', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'AdicionarParceiroCtrl'
        }).
        when('/parceiros/editar/:parceiroId', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'EditarParceiroCtrl'
        }).
        when('/projetos', {
            templateUrl: 'partials/multiple_elements.html',
            controller: 'ProjetosCtrl'
        }).
        when('/projetos/adicionar', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'AdicionarProjetoCtrl'
        }).
        when('/projetos/editar/:projetoId', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'EditarProjetoCtrl'
        }).
        when('/projetos/:projetoId', {
            templateUrl: 'partials/template_secao.html',
            controller: 'SecaoProjetoCtrl'
        }).
        when('/noticias', {
            templateUrl: 'partials/multiple_elements.html',
            controller: 'NoticiasCtrl'
        }).
        when('/noticias/adicionar', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'AdicionarNoticiaCtrl'
        }).
        when('/noticias/editar/:noticiaId', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'EditarNoticiaCtrl'
        }).
        when('/noticias/:noticiaId', {
            templateUrl: 'partials/template_secao.html',
            controller: 'SecaoNoticiaCtrl'
        }).
        when('/eventos', {
            templateUrl: 'partials/multiple_elements.html',
            controller: 'EventosCtrl'
        }).
        when('/eventos/adicionar', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'AdicionarEventoCtrl'
        }).
        when('/eventos/editar/:eventoId', {
            templateUrl: 'partials/adicionar_elemento.html',
            controller: 'EditarEventoCtrl'
        }).
        when('/eventos/:eventoId', {
            templateUrl: 'partials/template_secao.html',
            controller: 'SecaoEventoCtrl'
        }).
        when('/trabalhe_conosco', {
            templateUrl: 'partials/template_secao.html',
            controller: 'TrabalheCtrl'
        }).
        when('/contato', {
            templateUrl: 'partials/template_secao.html',
            controller: 'ContatoCtrl'
        }).
        when('/loja', {
            templateUrl: 'partials/template_secao.html',
            controller: 'LojaCtrl'
        }).
        when('/administrador', {
            templateUrl: 'partials/administrador.html',
            controller: 'AdminCtrl'
        }).
        when('/admin', {
            redirectTo: '/administrador'
        }).
        otherwise({
            redirectTo: '/inicio'
        });
}]);

samtApp.run(function ($http, $window) {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage.samtToken;
});

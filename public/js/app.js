'use strict';

/* App Module */

var samtApp = angular.module('samtApp',
		[
		 'ngRoute',
		 'samtAnimations',
		 'samtControllers',
		 'samtFilters',
		 'samtServices',
		 'samtDirectives',
		 'ngSanitize'
		 ]);

samtApp.config(['$routeProvider', function($routeProvider) {
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
	when('/parceiros/editar_parceiro/:parceiroId', {
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
    when('/projetos/:projetoId', {
        templateUrl: 'partials/template_secao.html',
        controller: 'SecaoProjetoCtrl'
    }).
	when('/noticias', {
		templateUrl: 'partials/multiple_elements.html',
		controller: 'NoticiasCtrl'
	}).
    when('/noticias/:noticiaId', {
        templateUrl: 'partials/template_secao.html',
        controller: 'SecaoNoticiaCtrl'
    }).
	when('/eventos', {
		templateUrl: 'partials/multiple_elements.html',
		controller: 'EventosCtrl'
	}).
    when('/eventos/:eventoId', {
        templateUrl: 'partials/template_secao.html',
        controller: 'SecaoEventoCtrl'
    }).
	when('/trabalhe_conosco', {
		templateUrl: 'partials/trabalhe_conosco.html',
		controller: 'PhoneListCtrl'
	}).
	when('/contato', {
		templateUrl: 'partials/contato.html',
		controller: 'PhoneListCtrl'
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

samtApp.run(function($http,$window){
	$http.defaults.headers.common['x-access-token'] = $window.localStorage.samtToken;
})

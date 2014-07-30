'use strict';

/* App Module */

var samtApp = angular.module('samtApp',
		[
		 'ngRoute',
		 'samtAnimations',
		 'samtControllers',
		 'samtFilters',
		 'samtServices',
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
	when('/projetos', {
		templateUrl: 'partials/multiple_elements.html',
		controller: 'ProjetosCtrl'
	}).
	when('/noticias', {
		templateUrl: 'partials/multiple_elements.html',
		controller: 'NoticiasCtrl'
	}).
	when('/eventos', {
		templateUrl: 'partials/multiple_elements.html',
		controller: 'EventosCtrl'
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
	when('/projetos/:projetoId', {
		templateUrl: 'partials/template_secao.html',
		controller: 'SecaoProjetoCtrl'
	}).
	when('/noticias/:noticiaId', {
		templateUrl: 'partials/template_secao.html',
		controller: 'SecaoNoticiaCtrl'
	}).
	when('/eventos/:eventoId', {
		templateUrl: 'partials/template_secao.html',
		controller: 'SecaoEventoCtrl'
	}).
	when('/phones/:phoneId', {
		templateUrl: 'partials/phone-detail.html',
		controller: 'PhoneDetailCtrl'
	}).
	otherwise({
		redirectTo: '/inicio'
	});
}]);

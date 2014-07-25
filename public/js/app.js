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
		templateUrl: 'partials/projetos.html',
		controller: 'ProjetosCtrl'
	}).
	when('/noticias', {
		templateUrl: 'partials/noticias.html',
		controller: 'PhoneListCtrl'
	}).
	when('/eventos', {
		templateUrl: 'partials/eventos.html',
		controller: 'PhoneListCtrl'
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
	when('/noticias/:noticiaId', {
		templateUrl: 'partials/noticia-detail.html',
		controller: 'NoticiaDetailCtrl'
	}).
	when('/phones/:phoneId', {
		templateUrl: 'partials/phone-detail.html',
		controller: 'PhoneDetailCtrl'
	}).
	otherwise({
		redirectTo: '/inicio'
	});
}]);

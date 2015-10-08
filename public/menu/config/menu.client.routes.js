// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'example' module routes
angular.module('menu').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'menu/views/menu.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]); 

// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('menu').controller('MenuController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// Expose the authentication service
		$scope.Authentication = Authentication;

		$scope.getMenuInclude = function() {
			if ($scope.Authentication.user){
				return 'menu/views/menu.client.view.loggedin.html';
			}else{
				return 'menu/views/menu.client.view.standard.html';
			}
		}
	}
]);

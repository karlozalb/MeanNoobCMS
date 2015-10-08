// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' module
angular.module('maincontent', []);

angular.module('maincontent').controller('MainContentController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.getMainContentInclude = function() {
			if (Authentication.user){
				return 'maincontent/views/maincontent.client.view.loggedin.html';
			}else{
				return 'maincontent/views/maincontent.client.view.standard.html';
			}
		}
	}
]);

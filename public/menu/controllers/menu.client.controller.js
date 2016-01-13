// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('menu').controller('MenuController', ['$scope','$rootScope','Authentication','$routeParams',
	function($scope,$rootScope,Authentication,$routeParams) {
		// Expose the authentication service
		$scope.Authentication = Authentication;		

		$scope.getMenuInclude = function() {
			if ($scope.Authentication.user){
				return 'menu/views/menu.client.view.loggedin.html';
			}else{
				return 'menu/views/menu.client.view.standard.html';
			}
		};

		$scope.onMenuClick = function($event) {
			if (window.innerWidth <= 760){			
				var element = $($event.currentTarget);
				console.log(element);
				if (element.hasClass('opened')) {
					element.removeClass('opened');
					element.siblings(".submenu").slideUp();
				}else{
					element.addClass('opened');
					element.siblings(".submenu").slideDown();
				}		
			}
		};

		/*$scope.searchArticles = function(category){			
            PaginatedCategorizedArticles.get({pageNumber: 1,searchCriteria: category},function(response){
            	$location.path('articles/page/1');
                $rootScope.articles = response.output;
                $rootScope.numpages = response.pageCount;
                if ($routeParams.pageNumber == undefined){
                	$rootScope.currentPageNumber = 1;
                }else{
                	$rootScope.currentPageNumber = parseInt($routeParams.pageNumber);                 
            	}
            },function(errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };*/
	}
]);

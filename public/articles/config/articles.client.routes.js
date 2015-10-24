// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'articles' module routes
angular.module('articles').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'articles/views/excerpt-article-list.client.view.html'
		}).		
		when('/articles/adminpanel', {
			templateUrl: 'articles/views/adminpanel-article.client.view.html'
		}).
		when('/articles/create', {
			templateUrl: 'articles/views/create-article.client.view.html'
		}).
		when('/articles/:articleId', {
			templateUrl: 'articles/views/view-article.client.view.html'
		}).
		when('/articles/adminpanel/:articleId', {
			templateUrl: 'articles/views/edit-article.client.view.html'
		});

	}
]); 
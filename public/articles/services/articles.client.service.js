// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('articles').factory('Articles', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/articles/:articleId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

angular.module('articles').factory('PaginatedArticles', ['$resource', function($resource) {
    return $resource('api/articles/page/:pageNumber/:searchCriteria', {
        pageNumber: '@page',
        searchCriteria: '@searchCriteria'
    });
}]);

	// Create the 'articles' service
angular.module('articles').factory('Comments', ['$resource', function($resource) {
    return $resource('api/comments/:commentId',{
    	commentId: '@_id'
    }, {
        update: {
            method: 'PUT',
            url: 'api/comments/:commentId',
            params: { commentId: '@_id' }
        }
    });
}]);

angular.module('articles').service('SharedArticlesService', function() {
    this.articles = {};

    return {
        getProperty: function () {
            return this.articles;
        },
        setProperty: function(value) {
            this.articles = value;
        }
    };
});


'use strict';

angular.module('menu').factory('PaginatedCategorizedArticles', ['$resource', function($resource) {
    return $resource('/api/articles/page/:pageNumber/category/:searchCriteria', {
        pageNumber: '@page',
        searchCriteria: '@searchCriteria'
    });
}]);
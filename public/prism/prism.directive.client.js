angular.module('Prism', []).
    directive('prism', [function() {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                element.ready(function() {
                    Prism.highlightElement(element[0]);
                });

                $scope.$watch(function(){return $scope.article;}, function () {
                    Prism.highlightElement(element[0]);
                });
            }
        } 
    }]
);
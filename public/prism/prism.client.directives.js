angular.module('Prism', []).
    directive('prism', [function() {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                element.ready(function() {
                    Prism.highlightAll();
                });
            }
        } 
    }]
);
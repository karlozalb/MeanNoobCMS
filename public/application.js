// Invoke 'strict' JavaScript mode
'use strict';

// Set the main application name
var mainApplicationModuleName = 'mean';

// Create the main application
var mainApplicationModule = angular.module(mainApplicationModuleName, ['ui.tinymce','ngResource', 'ngRoute', 'users', 'articles','menu','ngSanitize','vcRecaptcha','Prism']);

// Configure the hashbang URLs using the $locationProvider services 
mainApplicationModule.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

mainApplicationModule.controller('TinyMCEConfigController', function($scope) {
   $scope.tinymceOptions = {
    onChange: function(e) {
      // put logic here for keypress and cut/paste changes
    },
    inline: false,
    plugins : 'advlist autolink lists sh4tinymce link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table contextmenu paste',
    skin: 'lightgray',
    theme : 'modern',
    menubar : true,
    toolbar : 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | sh4tinymce | preview',
    extended_valid_elements : 'code[class|prism]'
  };
});

// Fix Facebook's OAuth bug
if (window.location.hash === '#_=_') window.location.hash = '#!';

// Manually bootstrap the AngularJS application
angular.element(document).ready(function() {
	angular.bootstrap(document, [mainApplicationModuleName]);
});
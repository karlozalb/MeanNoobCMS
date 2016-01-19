// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'tinimceconfig' module
angular.module('TinyMCEConfig', []);

angular.module('TinyMCEConfig').controller('TinyMCEController', function($scope) {
  $scope.tinymceOptions = {
    onChange: function(e) {
      // put logic here for keypress and cut/paste changes
    },
    inline: true,
    plugins : 'advlist autolink lists sh4tinymce link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table contextmenu paste',
    skin: 'lightgray',
    theme : 'modern',
    menubar : false,
    toolbar : 'sh4tinymce'
  };
});
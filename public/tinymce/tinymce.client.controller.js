// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'tinimceconfig' module
angular.module('tinymceconfig', []);

angular.module('tinymceconfig').controller('TinyMCEController', function($scope) {
  $scope.tinymceOptions = {
    onChange: function(e) {
      // put logic here for keypress and cut/paste changes
    },
    inline: false,
    plugins : 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table contextmenu paste',
    skin: 'lightgray',
    theme : 'modern'
  };
});
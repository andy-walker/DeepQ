app = angular.module('DeepQ', [
    'DeepQ.controllers'
]);

module = angular.module('DeepQ.controllers', [

]);

/**
 * Restrict name field on agent edit form to uppercase / disallow spaces
 */
app.directive('filterName', function() {
  return {
    restrict: 'A',

    link: function($scope, $element) {
      $element.bind('input', function() {
        $(this).val($(this).val().replace(/ /g, '').toUpperCase());
      });
    }
  };
});

/**
 * Restrict field to floating point number
 */
app.directive('filterFloat', function() {
  return {
    restrict: 'A',

    link: function($scope, $element) {
      $element.bind('input', function() {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
      });
    }
  };
});

/**
 * Restrict field to whole number
 */
app.directive('filterInteger', function() {
  return {
    restrict: 'A',

    link: function($scope, $element) {
      $element.bind('input', function() {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
      });
    }
  };
});
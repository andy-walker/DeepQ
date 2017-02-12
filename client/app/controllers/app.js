/**
 * Main application controller
 */
module.controller('AppCtrl', function($scope) {

    $scope.activeSection = 'agents';

    $scope.changeSection = function(section) {
        $scope.activeSection = section;
    }

});
/**
 * Main application controller
 */
module.controller('AppCtrl', function($scope) {

	window.appScope = $scope;

    $scope.activeSection = 'agent';
    
    $scope.section = {
    	
    	agent: {
    		mode: 'list'
    	},
    	
    	user: {
    		mode: 'list'
    	}

    };

    $scope.changeSection = function(section) {
        $scope.activeSection = section;
    };

    $scope.changeMode = function(sect, mode, entityID) {
    	
        $scope.section[sect].mode = mode;

        if (mode == 'edit') {
            angular.element(document.getElementById(sect + '-edit-form'))
                .scope()
                .loadForm(
                    entityID
                );
        } else if (mode == 'list') {
            angular.element(document.getElementById(sect + '-list'))
                .scope()
                .doSearch()
        }
    
    };

});
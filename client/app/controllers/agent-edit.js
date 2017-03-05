/**
 * Agents overview controller
 */
module.controller('AgentEditCtrl', function($scope, $http) {
    
    $scope.form = {
        name: '',
        spec: {}
    };

    /**
     * Change current view back to list
     */
    $scope.changeMode = function() {
    	appScope.changeMode('agent', 'list');
    };

    /**
     * Send a request to delete the agent
     */
    $scope.delete = function() {
        
    };

    /**
     * Send a request to export the agent
     */
    $scope.export = function() {

    };

    /**
     * Load data for the form
     */
    $scope.loadForm = function(agentName) {
        
        $http.post('/ajax/agent/load', {
            name: agentName
        }).success(function(data, status) {

            if (data.status != 'ok')
                return console.error(data.message);

            $scope.form = data.result;
            
        }).error(function(data, status) {
            console.error(data);
        });

    };

    $scope.saveForm = function() {
    	
        if ($scope.validateForm()) {
            
            $http.post('/ajax/agent/save', {
                form: $scope.form
            }).success(function(data, status) {

                if (data.status != 'ok')
                    return console.error(data.message);

                $scope.changeMode();
                
            }).error(function(data, status) {
                console.error(data);
            });

        }

    };

    $scope.validateForm = function() {
        return true;
    };

});
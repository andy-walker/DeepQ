/**
 * Agents overview controller
 */
module.controller('AgentListCtrl', function($scope, $http) {
    
    $scope.searchQuery = '';

    $scope.changeMode = function(agentName) {
        appScope.changeMode('agent', 'edit', agentName);
    };

    $scope.doSearch = function() {
        
        $http.post('/ajax/agent/search', {
            query: $scope.searchQuery
        }).success(function(data, status) {

            if (data.status != 'ok')
                return console.error(data.message);

            $scope.results = data.results;
            
        }).error(function(data, status) {
            console.error(data);
        });

    };

    $scope.doSearch();

});
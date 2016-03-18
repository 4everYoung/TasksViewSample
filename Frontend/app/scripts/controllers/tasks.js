'use strict';

/**
* @ngdoc function
* @name fakeLunchHubApp.controller:GroupsCtrl
* @description
* # GroupsCtrl
* Controller of the fakeLunchHubApp
*/

angular.module('taskViewSampleApp')
.controller('TasksCtrl', ['$scope', '$routeParams', 'Task', 'TaskGroup', function ($scope, $routeParams, Task, TaskGroup) {

  $scope.fetchTasks = function() {
    $scope.tasks = Task.query({ filters: $scope.filters })
  };

  $scope.joinTypeProvider = function(data) {
    return [data.provider, data.task_type].join('%')
  };

  $scope.setFiltersByTypeProvider = function(data) {
    var tmp = data.split('%')
    $scope.filters.provider   = tmp[0]
    $scope.filters.task_type  = tmp[1]
  };

  $scope.filters = {
    query:      '',
    task_type:  '',
    provider:   '',
    created_at: ''
  };

  $scope.$watch('task_type_provider', function(value){
    if (value) { $scope.setFiltersByTypeProvider(value) }
  });

  $scope.$watch('created_at', function(value){
    if (value) { $scope.filters.created_at = moment($scope.created_at).format('DD.MM.YYYY') }
  });

  TaskGroup.query().$promise.then(function(response){
    $scope.task_type_provider = $scope.joinTypeProvider(response[0]);
    $scope.task_types = response
  });

  $scope.fetchTasks()
  $scope.created_at = new Date

  $scope.myData = Task.query();
  $scope.columnDef = [
    {field: 'task_group.operator.name', displayName: "Operator", visible: true, headerCellTemplate:$scope.headerTpl},
    {field: 'description', displayName: "Description", visible: true, headerCellTemplate:$scope.headerTpl},
    {field: 'task_group.priority', displayName: "Priority", visible: true, headerCellTemplate:$scope.headerTpl},
    {field: 'task_group.name', displayName: "Group Name", visible: true, headerCellTemplate:$scope.headerTpl}
  ];
  $scope.gridOptions = {
    data: 'myData',
    enableRowHeaderSelection: false,
    multiSelect: false,
    enableFiltering: false,
    columnDefs: $scope.columnDef,
    enableColumnMenus: false,
    rawData: false,
    headerRowHeight: 32
  };
}]);

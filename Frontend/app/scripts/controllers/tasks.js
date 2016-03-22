'use strict';

angular.module('taskViewSampleApp')
.controller('TasksCtrl', ['$scope', 'breadcrumbs', '$routeParams', '$http', '$interval', 'Task', 'TaskGroup', function ($scope, breadcrumbs, $routeParams, $http, $interval, Task, TaskGroup) {
  $scope.breadcrumbs = breadcrumbs;
  $scope.breadcrumbs.generateBreadcrumbs();
  $scope.csvExport = function() {
    $http({
      method: 'post',
      url: '/api/tasks/export.json',
      data: { filters: $scope.filters }
    }).success(function(response) {
      console.log('Export to CSV started')
      $scope.exportJid = response.jid
      var checkPerform = $interval(function() {
        $http({
          method: 'get',
          url: "/api/tasks/check_perform/"+$scope.exportJid+".json",
        }).success(function(response){
          if (response.result == 'OK') {
            console.log('Successful finish of export')
            $interval.cancel(checkPerform)
          } else if (response.result == 'ERROR') {
            console.log('Some problem occured in process of export')
            $interval.cancel(checkPerform)
          }
        });
      }, 5000);
    });
  };

  $scope.fetchTasks = function() {
    $scope.tasksData = Task.query({ filters: $scope.filters });
    $scope.gridOptions = {
      data: 'tasksData',
      enableRowHeaderSelection: false,
      multiSelect: false,
      enableFiltering: false,
      columnDefs: $scope.columnDef,
      enableColumnMenus: false,
      rawData: false,
      enableSorting: true,
      enablePaging: true,
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0
    };
  };

  $scope.clearFilters = function() {
    $scope.created_at = new Date
    $scope.filters = {
      query:      '',
      task_type:  '',
      provider:   '',
      created_at: ''
    };
    $scope.fetchTasks();
  };

  $scope.joinTypeProvider = function(data) {
    return [data.provider, data.task_type].join('%')
  };

  $scope.setFiltersByTypeProvider = function(data) {
    var tmp = data.split('%');
    $scope.filters.provider   = tmp[0];
    $scope.filters.task_type  = tmp[1]
  };
  $scope.columnDef = [
    {
      field: 'test',
      displayName: '',
      visible: true,
      minWidth: 100,
      maxWidth: 100
    },
    {
      field: 'task_group.operator.name',
      displayName: "Operator",
      visible: true,
    },
    {
      field: 'description',
      displayName: "Description",
      visible: true 
    },
    { field: 'task_group.priority',
      displayName: "Priority",
      visible: true
    },
    {
      field: 'task_group.name',
      displayName: "Group Name",
      visible: true
    }
  ];

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
    $scope.filters.created_at = (value) ? moment($scope.created_at).format('DD.MM.YYYY') : ''
  });

  TaskGroup.query().$promise.then(function(response){
    $scope.task_type_provider = $scope.joinTypeProvider(response[0]);
    $scope.task_types = response
  });

  $scope.fetchTasks();
  $scope.created_at = new Date
}]);

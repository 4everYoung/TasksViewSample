'use strict';

angular.module('taskViewSampleApp')
.controller('TasksCtrl', ['$scope', '$routeParams', '$http', '$interval', 'Task', 'TaskGroup', function ($scope, $routeParams, $http, $interval, Task, TaskGroup) {

  $scope.csvExport = function() {
    $http({
      method: 'post',
      url: '/api/tasks/export.json',
      data: { filters: $scope.filters }
    }).success(function(response) {
      console.log('Запущен экспорт данных в csv-файл')
      $scope.exportJid = response.jid
      var checkPerform = $interval(function() {
        $http({
          method: 'get',
          url: "/api/tasks/check_perform/"+$scope.exportJid+".json",
        }).success(function(response){
          if (response.result == 'OK') { 
            console.log('Экспорт данных успешно завершен')
            $interval.cancel(checkPerform) 
          } else if (response.result == 'ERROR') {
            console.log('При экспорте данных возникла ошибка')
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
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 20
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
      field: 'task_group.operator.name',
      displayName: "Operator",
      visible: true},
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

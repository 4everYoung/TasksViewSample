'use strict';

app.controller(
  'SampleModalController', 
  ['$scope', '$routeParams', 'ModalService', 'Task', 
  function ($scope, $routeParams, ModalService, Task) {

  $scope.filters = {
    query:      '',
    task_type:  '',
    provider:   '',
    created_at: '',
    offset:     1,
    limit:      50
  }

  $scope.columnDef = [
    {
      name:         'operator_name',
      field:        'task_group.operator.name',
      displayName:  'Operator',
      visible:      true
    },
    {
      name:         'description',
      field:        'description',
      displayName:  'Description',
      visible:      true
    },
    {
      name:         'task_group_name_priority',
      field:        'task_group.priority',
      displayName:  'Priority',
      visible:      true
    },
    {
      name:         'task_group_name',
      field:        'task_group.name',
      displayName:  'Group Name',
      visible:      true
    },
    {
      name:         'assignor',
      field:        'assignee.full_name',
      displayName:  'Assignor',
      visible:      true
    }
  ]

  $scope.gridModalOptions = {
    enableRowSelection:         true,
    enableSelectAll:            true,
    selectionRowHeaderWidth:    35,
    multiSelect:                true,
    enableFiltering:            false,
    columnDefs:                 $scope.columnDef,
    enableColumnMenus:          false,
    rawData:                    false,
    enableSorting:              true,
    enableHorizontalScrollbar:  0,
    enablePaging:               true,
    paginationPageSizes:        [25, 50, 75, 100],
    paginationPageSize:         25,
    paginationCurrentPage:      1,
    useExternalPagination:      true
  }
  Task.query({ filters: $scope.filters }).$promise.then(function(response){
    $scope.gridModalOptions.data        = response.tasks
    $scope.gridModalOptions.totalItems  = response.meta.total_items
  })
}]);


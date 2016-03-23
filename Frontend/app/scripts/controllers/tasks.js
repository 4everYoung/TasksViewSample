'use strict';

angular.module('taskViewSampleApp')
.controller('TasksCtrl', ['$scope', 'breadcrumbs', '$routeParams', '$http', '$interval', 'Task', 'TaskGroup', function ($scope, breadcrumbs, $routeParams, $http, $interval, Task, TaskGroup) {
  $scope.breadcrumbs = breadcrumbs
  $scope.breadcrumbs.generateBreadcrumbs()

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
        })
      }, 5000)
    });
  };

  $scope.fetchTasks = function(isUpdateFilters) {
    if (isUpdateFilters) {
      $scope.filtersForSearch = $.extend(true, {}, $scope.filters)
      $scope.fetchPaginationFilters(1)
    }

    $scope.filtersForSearch.offset  = $scope.filters.offset
    $scope.filtersForSearch.limit   = $scope.filters.limit

    Task.query({ filters: $scope.filtersForSearch }).$promise.then(function(response){
      $scope.tasksData              = response.tasks
      $scope.gridOptions.totalItems = response.meta.total_items
      $scope.gridGoToPage($scope.filters.offset)
    })
  }

  $scope.fetchTaskGroups = function() {
    TaskGroup.query().$promise.then(function(response){
      $scope.initializeTaskTypeProvider()
      $scope.task_types = response
    })
  }

  $scope.initializeCreatedAt = function() {
    $scope.created_at = new Date
  }

  $scope.initializeTaskTypeProvider = function() {
    $scope.task_type_provider = $scope.joinTypeProvider({provider: '', task_type: ''})
  }

  $scope.joinTypeProvider = function(data) {
    return [data.provider, data.task_type].join('%')
  };

  $scope.setFiltersByTypeProvider = function(data) {
    var tmp = data.split('%')
    $scope.filters.provider   = tmp[0]
    $scope.filters.task_type  = tmp[1]
  }

  $scope.initializeFilters = function() {
    $scope.createEmptyFiltersObj()
    $scope.filtersForSearch = $.extend(true, {}, $scope.filters)
  }

  $scope.createEmptyFiltersObj = function() {
     $scope.filters = {
      query:      '',
      task_type:  '',
      provider:   '',
      created_at: ''
    }
    $scope.fetchPaginationFilters(1)
  }

  $scope.fetchPaginationFilters = function(offset, limit) {
    $scope.filters.offset = offset  || $scope.gridOptions.paginationCurrentPage
    $scope.filters.limit  = limit   || $scope.gridOptions.paginationPageSize
  }

  $scope.clearFilters = function() {
    $scope.createEmptyFiltersObj()
    $scope.initializeCreatedAt()
    $scope.initializeTaskTypeProvider()
    $scope.fetchTasks(true)
  }

  $scope.initializeGrid = function() {
    $scope.columnDef = [
      {
        field:        'active',
        displayName:  '',
        type:         'boolean',
        headerCellTemplate: '<input type="checkbox" style="margin-left: 14px; margin-top: 16px">',
        cellTemplate: '<input type="checkbox" style="margin-left: 14px;">',
        visible:      true,
        maxWidth: 40
      },
      {
        field:        'task_group.operator.name',
        displayName:  'Operator',
        visible:      true
      },
      {
        field:        'description',
        displayName:  'Description',
        visible:      true
      },
      { field:        'task_group.priority',
        displayName:  'Priority',
        visible:      true
      },
      {
        field:        'task_group.name',
        displayName:  'Group Name',
        visible:      true
      }
    ]

    $scope.gridOptions = {
      data:                       'tasksData',
      enableRowHeaderSelection:   false,
      multiSelect:                false,
      enableFiltering:            false,
      columnDefs:                 $scope.columnDef,
      enableColumnMenus:          false,
      rawData:                    false,
      enableSorting:              true,
      enableHorizontalScrollbar:  0,
      enableVerticalScrollbar:    0,
      enablePaging:               true,
      paginationPageSizes:        [25, 50, 75],
      paginationPageSize:         25,
      paginationCurrentPage:      1,
      useExternalPagination:      true,
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi

        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          if ($scope.filters.limit == pageSize) {
            $scope.gridGoToPage(newPage)
          }
          else {
            $scope.gridGoToPage()
          }

          $scope.fetchPaginationFilters()
          $scope.fetchTasks(false)
        })
      }
    }
  }

  $scope.gridGoToPage = function(value) {
    $scope.gridOptions.paginationCurrentPage = value || 1
  }

  $scope.initializeWatchers = function() {
    $scope.$watch('task_type_provider', function(value){
      if (value) { $scope.setFiltersByTypeProvider(value) }
    })

    $scope.$watch('created_at', function(value){
      $scope.filters.created_at = (value) ? moment($scope.created_at).format('DD.MM.YYYY') : ''
    })
  }

  $scope.initializeCreatedAt()
  $scope.initializeGrid()
  $scope.initializeFilters()
  $scope.initializeWatchers()

  $scope.fetchTaskGroups()
  $scope.fetchTasks(true)
}]);

'use strict';

app.controller(
  'TasksCtrl',
  ['$scope', 'breadcrumbs', '$routeParams', '$http', '$interval', 'ModalService', 'Task', 'TaskGroup',
  function ($scope, breadcrumbs, $routeParams, $http, $interval, ModalService, Task, TaskGroup) {

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
      $scope.gridOptions.data       = response.tasks
      $scope.gridOptions.totalItems = response.meta.total_items
      $scope.gridGoToPage($scope.filters.offset)
    })
  }

  $scope.fetchTaskGroups = function() {
    TaskGroup.query({ group_by: true }).$promise.then(function(response){
      $scope.task_types = response.groups
    })
  }

  $scope.deleteTask = function($event) {
    if (confirm('Are you sure?')) {
      var rows  = $scope.gridApi.selection.getSelectedRows()
      var ids   = rows.map(function(obj){return obj.id})

      Task.remove({ids: ids, filters: $scope.filters }).$promise.then(function(response){
        console.log(response.count+" records have been removed")
        angular.forEach(rows, function (row, i) {
          var index = $scope.gridOptions.data.lastIndexOf(row);
          $scope.gridOptions.data.splice(index, 1);
        });
        angular.forEach(response.tasks, function (task, i) {
          $scope.gridOptions.data.push(task)
        });
      })
    }
  }

  $scope.unassignTask = function($event) {
    var rows  = $scope.gridApi.selection.getSelectedRows()
    var ids   = rows.map(function(obj){return obj.id})
 
    Task.unassign({ids: ids }).$promise.then(function(response){
      console.log(response.count+" records have been unassigned")
      angular.forEach(rows, function (row, i) {
        var index = $scope.gridOptions.data.lastIndexOf(row);
        $scope.gridOptions.data[index].assignee = null  
      }); 
      $scope.gridApi.selection.clearSelectedRows();      
    })  
  }

  $scope.assignTasks = function() {
    var modalInstance = ModalService.showModal({
      templateUrl:  "./views/modal/assign.html",
      controller:   "AssignModalController",
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        if (result.uid) {
          var rows  = $scope.gridApi.selection.getSelectedRows()
          var ids   = rows.map(function(obj){return obj.id})

          Task.assign({ids: ids, assignee_id: result.uid}).$promise.then(function(response){
            console.log(response.count+" records have been assigned")
            angular.forEach(rows, function (row, i) {
              var index = $scope.gridOptions.data.lastIndexOf(row);
              var cellData = $scope.gridOptions.data[index]
              if (!cellData.assignee) { cellData.assignee = {} }         
              $scope.gridOptions.data[index].assignee.name = response.assignee.full_name; 
            }); 
            $scope.gridApi.selection.clearSelectedRows();      
          })     
        }
      });
    });
  }

  $scope.initializeCreatedAt = function() {
    $scope.created_at = new Date
  }

  $scope.initializeFilters = function() {
    $scope.createEmptyFiltersObj()
    $scope.filtersForSearch = $.extend(true, {}, $scope.filters)
  }

  $scope.createEmptyFiltersObj = function() {
     $scope.filters = {
      query:          '',
      created_at:     '',
      provider_type:  ''
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
    $scope.fetchTasks(true)
  }

  $scope.initializeGrid = function() {
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
        name:         'assignee',
        field:        'assignee.name',
        displayName:  'Assignee',
        visible:      true
      }
    ]

    $scope.gridOptions = {
      columnDefs:                 $scope.columnDef,
      enableRowSelection:         true,
      enableSelectAll:            true,
      selectionRowHeaderWidth:    35,
      multiSelect:                true,
      enableFiltering:            false,
      enableColumnMenus:          false,
      rawData:                    false,
      enableSorting:              true,
      enableHorizontalScrollbar:  0,
      enablePaging:               true,
      paginationPageSizes:        [25, 50, 75, 100],
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
          $('.ui-grid-canvas').height(600)
        });
        gridApi.selection.on.rowSelectionChanged($scope, function() {
          $(".grid-actions-btns .btn").attr("disabled", !($scope.gridApi.selection.getSelectedCount() > 0));
        });
        gridApi.selection.on.rowSelectionChangedBatch($scope, function() {
          $(".grid-actions-btns .btn").attr("disabled", !($scope.gridApi.selection.getSelectedCount() > 0));
        });
      }
    }
  }

  $scope.gridGoToPage = function(value) {
    $scope.gridOptions.paginationCurrentPage = value || 1
  }

  $scope.initializeWatchers = function() {
    $scope.$watch('created_at', function(value){
      $scope.filters.created_at = (value) ? moment($scope.created_at).format('DD.MM.YYYY') : ''
    })
  }

  $scope.initializeGrid()
  $scope.initializeFilters()
  $scope.initializeWatchers()

  $scope.fetchTaskGroups()
  $scope.fetchTasks(true)
}]);

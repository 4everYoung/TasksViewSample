app.controller(
  'AssignModalController', 
  ['$scope', '$routeParams', '$element', 'close', 'ModalService', 'User', 
  function ($scope, $routeParams, $element, close, ModalService, User) {

  $scope.filters = {
    offset:     1,
    limit:      25
  }

  $scope.columnDef = [
    {
      name:         'user_name',
      field:        'full_name',
      displayName:  'Name',
      visible:      true
    },
    {
      name:         'email',
      field:        'email',
      displayName:  'Email',
      visible:      true
    }
  ]

  $scope.gridModalOptions = {
    enableRowSelection:         true,
    enableSelectAll:            true,
    selectionRowHeaderWidth:    35,
    multiSelect:                false,
    enableFiltering:            false,
    columnDefs:                 $scope.columnDef,
    enableColumnMenus:          false,
    rawData:                    false,
    enableSorting:              true,
    enableHorizontalScrollbar:  0,
    enablePaging:               false,
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
        $scope.fetchUsers()
      });
    }
  }

  $scope.fetchPaginationFilters = function(offset, limit) {
    $scope.filters.offset = offset  || $scope.gridModalOptions.paginationCurrentPage
    $scope.filters.limit  = limit   || $scope.gridModalOptions.paginationPageSize
  }

  $scope.gridGoToPage = function(value) {
    $scope.gridModalOptions.paginationCurrentPage = value || 1
  }

  $scope.fetchUsers = function() {
    User.query({ filters: $scope.filters }).$promise.then(function(response){
      $scope.gridModalOptions.data        = response.users
      $scope.gridModalOptions.totalItems  = response.total_items
      $scope.gridGoToPage($scope.filters.offset)
    })
  }

  $scope.setAssignee = function() {
    var row = $scope.gridApi.selection.getSelectedRows()
    if (row.length) { 
      close({ uid: row[0]['id'] }, 500);
    }
  }

  $scope.close = function() {
    close({}, 500);
  };

  $scope.fetchUsers()
}]);
'use strict';

app.controller(
  'CreateTasksCtrl',
  ['$scope', 'breadcrumbs', '$routeParams', 'User', 'Task', 'TaskGroup', 'Business', 'Device', '$location',
  function ($scope, breadcrumbs, $routeParams, User, Task, TaskGroup, Business, Device, $location) {

  $scope.breadcrumbs = breadcrumbs
  $scope.breadcrumbs.generateBreadcrumbs()

  $scope.fetchTaskGroups = function() {
    TaskGroup.query().$promise.then(function(response){
      $scope.task_types = response
    })
  }

  $scope.fetchUsers = function() {
    User.query().$promise.then(function(response){
      $scope.users = response.users
    })
  }

  $scope.fetchDevices = function() {
    Device.query().$promise.then(function(response){
      $scope.devices = response.devices
    })
  }

  $scope.cancel = function() {
    $location.path(window.history.back());
  };

  $scope.addTask = function() {
    if ($scope.selectedBusinesses) {
      $scope.form.business_id = $scope.selectedBusinesses.originalObject.id
    }
    Task.create({task: $scope.form}).$promise.then(function(response){
      $location.path(window.history.back());
    })
  };

  $scope.fetchTaskGroups()
  $scope.fetchUsers()
  $scope.fetchDevices()
}]);

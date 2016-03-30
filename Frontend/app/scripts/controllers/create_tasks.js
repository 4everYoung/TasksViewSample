'use strict';

app.controller(
  'CreateTasksCtrl',
  ['$scope', 'breadcrumbs', '$routeParams', 'User', 'Task', 'TaskGroup', '$location',
  function ($scope, breadcrumbs, $routeParams, User, Task, TaskGroup, $location) {

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

  $scope.cancel = function() {
    $location.path(window.history.back());
  };

  $scope.add_task = function() {
    Task.create({attributes: $("#create-form").serializeArray()}).$promise.then(function(response){
      $location.path(window.history.back());
    })
  };

  $scope.fetchTaskGroups()
  $scope.fetchUsers()
}]);

'use strict';

app.controller(
  'CreateTasksCtrl',
  ['$scope', 'breadcrumbs', '$routeParams', 'User', 'Task', 'TaskGroup', 'Business', 'Device','ModalService', '$location',
  function ($scope, breadcrumbs, $routeParams, User, Task, TaskGroup, Business, Device, ModalService, $location) {

  $scope.breadcrumbs = breadcrumbs
  $scope.breadcrumbs.generateBreadcrumbs()

  $scope.fetchDevices = function() {
    Device.query().$promise.then(function(response){
      $scope.devices = response.devices
    })
  }

  $scope.cancel = function() {
    $location.path(window.history.back());
  };

  $scope.collectSelectedAttributes = function() {
    if ($scope.selected.business) {
      $scope.form.business_id = $scope.selected.business.originalObject.id
    }
    if ($scope.selected.assignee) {
      $scope.form.assignee_id = $scope.selected.assignee.originalObject.id    
    }
  };

  $scope.addTask = function() {
    if ($scope.selected) { $scope.collectSelectedAttributes() } 
    Task.create({task: $scope.form}).$promise.then(function(response){
      $location.path(window.history.back());
    })
  };

  $scope.showModal = function(template, controller) {
    ModalService.showModal({
      templateUrl:  template,
      controller:   controller,
      inputs: {
        provider_type: $scope.selected.provider_type.title
      }
    }).then(function(modal) {
      $scope.form.task_group_name = null
      $scope.form.task_group_id   = null
      modal.element.modal();
      modal.close.then(function(result) {
        if (result.group) {
          $scope.form.task_group_name = result.group.name  
          $scope.form.task_group_id   = result.group.id  
        }
      });
    });
  }

  $scope.initializeWatchers = function() {
    $scope.$watch('selected.provider_type', function(value){
      if (value) {
        $scope.showModal("./views/modal/task_groups.html", "TaskGroupModalController")
      }
    })
  }

  $scope.form = {}
  $scope.fetchDevices()
  $scope.initializeWatchers()
}]);

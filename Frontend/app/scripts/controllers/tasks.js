'use strict';
 
/**
 * @ngdoc function
 * @name fakeLunchHubApp.controller:GroupsCtrl
 * @description
 * # GroupsCtrl
 * Controller of the fakeLunchHubApp
 */

angular.module('taskViewSampleApp')
  .controller('TasksCtrl', ['$scope', '$routeParams', 'Task', function ($scope, $routeParams, Task) {
    $scope.tasks = Task.query();
  }]);
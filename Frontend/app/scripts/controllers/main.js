'use strict';

/**
 * @ngdoc function
 * @name taskViewSampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the taskViewSampleApp
 */
angular.module('taskViewSampleApp')
  .controller('MainCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    $scope.breadcrumbs.generateBreadcrumbs();
  }]);

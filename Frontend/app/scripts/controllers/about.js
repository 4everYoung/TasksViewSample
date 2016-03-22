'use strict';

/**
 * @ngdoc function
 * @name taskViewSampleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the taskViewSampleApp
 */
angular.module('taskViewSampleApp')
  .controller('AboutCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
    $scope.breadcrumbs.generateBreadcrumbs();
  }]);

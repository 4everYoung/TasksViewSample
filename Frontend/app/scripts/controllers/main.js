'use strict';

/**
 * @ngdoc function
 * @name taskViewSampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the taskViewSampleApp
 */

app.controller('MainCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
  $scope.breadcrumbs = breadcrumbs;
  $scope.breadcrumbs.generateBreadcrumbs();
}]);

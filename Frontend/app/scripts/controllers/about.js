'use strict';

/**
 * @ngdoc function
 * @name taskViewSampleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the taskViewSampleApp
 */
app.controller('AboutCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
  $scope.breadcrumbs = breadcrumbs;
  $scope.breadcrumbs.generateBreadcrumbs();
}]);

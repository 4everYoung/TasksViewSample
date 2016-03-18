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
  $scope.myData = Task.query();
  $scope.headerTpl = '<div ng-click="col.sort()" ng-class="{ ngSorted: !noSortVisible }">'+
    '<span class="ngHeaderText">{{col.displayName}}</span>'+
    '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
    '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
    '</div>'+
    '<div ng-show="col.allowResize" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

  $scope.columnDef = [
    {field: 'task_group.operator.name', displayName: "Operator", visible: true, headerCellTemplate:$scope.headerTpl},
    {field: 'description', displayName: "Description", visible: true, headerCellTemplate:$scope.headerTpl},
    {field: 'task_group.priority', displayName: "Priority", visible: true, headerCellTemplate:$scope.headerTpl},
    {field: 'task_group.name', displayName: "Group Name", visible: true, headerCellTemplate:$scope.headerTpl}
  ];
  $scope.gridOptions = {
    data: 'myData',
    enableRowHeaderSelection: false,
    multiSelect: false,
    enableFiltering: false,
    columnDefs: $scope.columnDef,
    enableColumnMenus: false,
    rawData: false,
    headerRowHeight: 32
  };

}]);

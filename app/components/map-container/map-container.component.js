'use strict';

angular.
  module('mapContainer').
  component('mapContainer',
  {
    templateUrl: 'components/map-container/map-container.template.html',
    controller:
      ['$scope','dbAccess',
      function mapContainerController($scope, dbAccess)
      {
        var data = dbAccess.getData();
        console.log("db access returned : ");
        console.log(data);
        $scope.users = data;
      }]
  });
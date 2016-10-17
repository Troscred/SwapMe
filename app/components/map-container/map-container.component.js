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
        console.log("GOT : ");
        console.log(dbAccess.getData());
        $scope.users = dbAccess.getData();
      }]
  });
'use strict';

angular.
  module('mapContainer').
  component('mapContainer',
  {
    templateUrl: 'components/map-container/map-container.template.html',
    controller:
      ['dbAccess', function mapContainerController(dbAccess)
      {
        console.log("GOT : ");
        console.log(dbAccess.query());
        // $scope.users = dbAccess.query();
      }]
  });
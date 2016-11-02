'use strict';

angular.module('searchEngine')
  .component('searchEngine',
  {
    templateUrl:
      'components/search-engine/search-engine.template.html',
    controller:
      ('searchEngineController',
      ['$scope', '$timeout',
      function ($scope, $timeout)
      {
        var addUserMarker = function()
        {
          $scope.$broadcast("addUser", {location:[46.217852, 6.157264], fullName:"Robert Pute"});
        }
        $timeout(function()
        {
          addUserMarker();
        }, 1000);
      }])
  });
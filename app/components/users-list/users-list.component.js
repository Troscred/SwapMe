'use strict';

angular.module('usersList')
  .component('usersList',
  {
    templateUrl:
      'components/users-list/users-list.template.html',
    controller:
      ('usersListController',
      ['$scope', 'CST',
      function ($scope, CST)
      {
        $scope.activeFilters = 0; // Condition for the cross to appear (ng-if)
        
        //
        // -- USER INTERACTIONS --
        //
        
        $scope.filterButtonClick = function(filter)
        {
          if (filter == null) // Cross
          {
            $scope.$parent.usersFilters.forEach(function(filter)
            {
              filter.active = false; // Clear all filters
            });
            $scope.activeFilters = 0;
          }
          else // Filter button
          {
            if (filter.active)
            {
              filter.active = false;
              $scope.activeFilters -= 1;
            }
            else
            {
              filter.active = true;
              $scope.activeFilters += 1;
            }
          }
          $scope.$emit(CST.CHANGEFILTERS);
        }
      }])
  });
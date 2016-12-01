'use strict';

angular.module('usersList')
  .component('usersList',
  {
    templateUrl:
      'components/users-list/users-list.template.html',
    controller:
      ('usersListController',
      ['$scope', 'EVENTS',
      function ($scope, EVENTS)
      {
        $scope.users = [];
        $scope.filterOptions = ["Tous", "RG", "RD", "Majeurs", "Réinit."];
        
        //
        // -- EVENTS --
        //
        
        // Called from parent
        $scope.$on(EVENTS.SETUSERS, function(event, args)
        {
          args.forEach(function(user)
          {
            $scope.users.push({name : user.surname + " " + user.name});
          });
        });
        
        //
        // -- USER INTERACTIONS --
        //
        
        $scope.filterButtonClick = function(option) // FILTERS ACCROSS USERS-LIST, NOT GOING UP IN HIERARCHY. WHAT ABOUT MAP-CONTAINER???
        {
          console.log(option + " Button clicked!");
        }
      }])
  });
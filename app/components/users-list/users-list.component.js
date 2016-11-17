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
        $scope.users = $scope.$parent.users;
        
        $scope.onClickRG = function()
        {
          console.log("RG Button clicked!");
        }
        
        // Called from parent
        $scope.$on(EVENTS.ADDUSER, function(event, args)
        {
//          console.log("userList got <Add user> event");
        });
      }])
  });
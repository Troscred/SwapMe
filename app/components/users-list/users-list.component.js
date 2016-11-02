'use strict';

angular.module('usersList')
  .component('usersList',
  {
    templateUrl:
      'components/users-list/users-list.template.html',
    controller:
      ('usersListController',
      ['$scope', 'dbAccess',
      function ($scope, dbAccess)
      {
        //
        // -- DB ACCESS --
        //
        dbAccess.getUsers(function(users) // DB Success
        {
          $scope.users = users;
          console.log(users);
        });
        
        //
        // -- FILTER --
        //
        $scope.onClickRG = function()
        {
          console.log("RG Button clicked!");
        }
      }])
  });
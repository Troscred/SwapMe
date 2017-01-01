'use strict';

angular.module('searchEngine')
  .component('searchEngine',
  {
    templateUrl:
      'components/search-engine/search-engine.template.html',
    controller:
      ('searchEngineController',
      ['$scope', '$q', '$window', 'CST', 'dbAccess',
      function ($scope, $q, $window, CST, dbAccess)
      {
        $scope.catMenuList = [];      // Subset of categories
        $scope.selectedCat = null;    // Selected category in catMenuList
        $scope.requestedUsers = [];   // Subset of users
        
        $scope.usersFilters =         // Filters used in usersList module
        [
          {name: "RG", filteredId: [2,4], active: false},
          {name: "RD", filteredId: [1,3,5,6], active: false},
          {name: "Ruskov", filteredId: [1,2,3,5], active: false},
          {name: "Niac", filteredId: [1,3], active: false}
        ];
        
        var users = [],               // { id_user / name / surname / age / address / image }
            categories = [],          // { id_category / name / description / id_parent }
            nbServices = [],          // { id_category / id_parent / nb_serv }
            usersByCat = [];          // { id_category / id_parent / id_user }
        
        var filteredUsersId = [],     // Id of users not included in list
            scopeCatId = 0;           // Id of unfolded category in catMenuList - 0 if menu is in initial state
        
        //
        // -- FUNCTIONS --
        //
        
        function getCatChilds(parentId) // Determine which categories are displayed on the list menu
        {
          return categories.filter(function(category)
          {
            return category.id_parent == parentId;
          });
        }
        
        $scope.getNbServices = function(categoryId) // Return number of services by category
        {                                           // Element pattern : { category / parent / nb-serv }
          var val = 0;
          
          nbServices.forEach(function(element)
          {
            if (categoryId == element.id_category) // Sub category
            {
              val = element.nb_serv; // Can't return here. Would break "forEach" only
            }
            else if (categoryId == element.id_parent) // Main category : count nb of sub
            {
              val += element.nb_serv;
            }
          });
          
          return val; // --------!!!! Should return nb_serv of ANY category (main and sub) !!!!--------
        }
        
        function updateRequestedUsers()
        {
          getUsersIdByCat(scopeCatId).then(function(usersScope)
          {
            if (filteredUsersId.length) // Filter enabled
            {
              $scope.requestedUsers = users.filter(function(user)
              {
                var userId = user.id_user;
                return !filteredUsersId.includes(userId) && usersScope.includes(userId);
              });
            }
            else
            {
              $scope.requestedUsers = users.filter(function(user)
              {
                return usersScope.includes(user.id_user);
              });
            }
          });
        }
        
        //
        // -- DB ACCESS --
        //
        
        // Users
        var gotUsers = dbAccess.users.query(function(allUsers)
        {
          users = allUsers;
        },
        function(err)
        {
          console.error("Error while accessing users in db !");
        });
        
        // Categories
        var gotCategories = dbAccess.categories.query(function(result)
        {
          categories = result;
          
          $scope.catMenuList = getCatChilds(null);
        },
        function(err)
        {
          console.error("Error while accessing categories in db !");
        });
        
        // Number of services by categories
        var gotNbServices =  dbAccess.nbServices.query(function(result) // Ideally: get a TABLE with main and sub categories on the same column
        {
          nbServices = result;
        },
        function(err)
        {
          console.error("Error while accessing nbServices in db !");
        });
        
        // Users that give services by categories
        function getUsersIdByCat(categoryId)
        { // Is it optimized to query DB each time we click on menu ???? Otherwhise should get huge list of all users by category -> not best... ???
          return dbAccess.usersByCat.query({id_category: categoryId},
          function(result){},
          function(err)
          {
            console.error("Error while accessing usersByCat in db !");
          })
          .$promise.then(function (result) // Preprocessing : [obj, obj, ...] -> [id1, id2, ...]
          {
            var ids = [];
            result.forEach(function (obj)
            {
              ids.push(obj.id_user);
            });
            return ids;
          });
        }
        
        function gotAllRequest()
        {
          return $q.all([gotUsers.$promise,
                         gotCategories.$promise,
                         gotNbServices.$promise]);
        }
        
        //
        // -- EVENTS --
        //
        
        $scope.$on(CST.MAPLOADED, function() // Called once
        {
          gotAllRequest().then(function()
          {
            $scope.$on(CST.CHANGEFILTERS, function()
            {
              filteredUsersId = [];
              $scope.usersFilters.forEach(function(filter)
              {
                if (filter.active)
                {
                  filter.filteredId.forEach(function(id)
                  {
                    if (!filteredUsersId.includes(id))
                    {
                      filteredUsersId.push(id);
                    }
                  });
                }
              });
              updateRequestedUsers();
            });
            
            // Other events
            // ...
          });
        });
        
        //
        // -- USER INTERACTION --
        //
        
        $scope.catMenuListClick = function(category)
        {
          if (category == null) // Retour
          {
            $scope.showSubCategories = false;
            $scope.catMenuList = getCatChilds(null);
            $scope.selectedCat = null;
            scopeCatId = 0;
          }
          else // Any category
          {
            if (category.id_parent == null) // Main category
            {
              $scope.showSubCategories = true;
              $scope.catMenuList = getCatChilds(category.id_category);
              scopeCatId = category.id_category;
            }
            else // Sub category
            {
              $window.document.activeElement.blur(); // Clear active class on element
              if ($scope.selectedCat == category) // Sub category : selected
              {
                $scope.selectedCat = null;
                scopeCatId = category.id_parent; // Restore main category
              }
              else // Sub category : not selected
              {
                $scope.selectedCat = category;
                scopeCatId = category.id_category;
              }
            }
          }
          updateRequestedUsers();
        }
      }])
  });
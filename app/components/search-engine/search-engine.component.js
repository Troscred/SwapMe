'use strict';

angular.module('searchEngine')
  .component('searchEngine',
  {
    templateUrl:
      'components/search-engine/search-engine.template.html',
    controller:
      ('searchEngineController',
      ['$scope', 'EVENTS', 'dbAccess',
      function ($scope, EVENTS, dbAccess)
      {
        var geocoder = new google.maps.Geocoder(),
            requestedUsers = [],
            categories = [];
        
        //
        // -- FUNCTIONS --
        //
        
        function setCatList(parent)
        {
          $scope.catList = [];
          categories.forEach(function(category)
          {
            if (category.id_parent == parent)
            {
              $scope.catList.push(category);
            }
          });
        }
        
        //
        // -- DB ACCESS --
        //
        
        // Users
        var gotUsers = dbAccess.users.query(function(users)
        {
          $scope.users = users;
          users.forEach(function(user) // Instead of for loop to get dinstinct closure for every iteration
          {
            // Geocoding
            geocoder.geocode({"address": user.address + ", Suisse", "region": "CH"},function(results, status) // API KEY?
            {
              if (status == google.maps.GeocoderStatus.OK && results.length > 0) // Geocoding success
              {
                var loc = results[0].geometry.location;
                requestedUsers.push({"surname":user.surname, "name":user.name, "location":[loc.lat(), loc.lng()], "img":user.image});
              }
              else // Geocoding failure
              {
                console.error("Geocoding process failed for " + user.Name);
              }
            });
          });
          
          $scope.users = users;
        },
        function(err) // DB Failure
        {
          console.error("Error while fetching users from db !");
        });
        
        // Categories
        dbAccess.categories.query(function(result)
        {
          categories = result;
          
          setCatList(null);
        });
        
        //
        // -- EVENTS --
        //
        
        $scope.$on(EVENTS.MAPLOADED, function() // Map fully loaded
        {
          gotUsers.$promise.then(function() // Wait for this process to be completed
          {
            $scope.$broadcast(EVENTS.SETUSERS, requestedUsers); // To childs
          });
        });
        
        //
        // -- USER INTERACTION --
        //
        
        $scope.catListClick = function(category)
        {          
          if (category.id_parent == null) // Clicked on main category
          {
            setCatList(category.id_category);
          }
          else // Clicked on subcategory
          {
            // Set requestedUsers (filter by Category) and broadcast SETUSERS
          }
        }
      }])
  });
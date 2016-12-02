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
            categories = [],
            nbServices = [];
        
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
        
        $scope.getNbServices = function(category) // Should return nb_serv of ANY category (main and sub)
        {
          // Wait until db request completed???
          
          var val = 0,
              id = category.id_category;
          
          
          nbServices.forEach(function(element)
          {
            if (id == element.id_category) // Sub category
            {
              console.log(category.name + " " + element.nb_serv);
              val = element.nb_serv; // Can't return here. Would break "forEach" only
            }
            else if (id == element.id_parent) // Main category : count nb of sub
            {
              val += element.nb_serv;
            }
          });
          
          return val;
          
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
        
        // Number of services by categories
        var gotNbServices = dbAccess.nbServices.query(function(result) // Ideally: get a TABLE with main and sub categories on the same column
        {
          nbServices = result;
          
          console.log(nbServices);
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
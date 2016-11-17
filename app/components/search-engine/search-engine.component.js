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
        var geocoder = new google.maps.Geocoder();
        var servCategories = null;
        var usersInfo = [];
        
        //
        // -- DB ACCESS --
        //
        
        // Users
        dbAccess.users.query(function(users)
        {
          $scope.users = users;
          users.forEach(function(user) // Instead of for loop to get dinstinct closure for every iteration
          {
            // Geocoding
            geocoder.geocode({"address": user.Adresse + ", Suisse", "region": "CH"},function(results, status) // API KEY?
            {
              if (status == google.maps.GeocoderStatus.OK && results.length > 0) // Geocoding success
              {
                var loc = results[0].geometry.location;
                if (usersInfo.push({"surname":user.Surname, "name":user.Name, "pos":[loc.lat(), loc.lng()], "img":user.Image}) == users.length) // Push returns new array's length
                {
//                  $scope.$apply(); // Preprocessing over. Launch digest. Only if html needs scope
                }
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
        
        // Services
        function getKeys(obj)
        {
          var keyArray = [];
          angular.forEach(obj, function(value, key)
          {
            if (key != "$promise" && key != "$resolved") // Resource object!
            keyArray.push(key);
          });
          return keyArray;
        }
        
//        function defineCategories()
//        {
//          $scope.categories = [];
//          
//        }
        
        dbAccess.services.get(function(result)
        {
          servCategories = result;
          
          $scope.categories = getKeys(result);
          
          console.log("Services from json :");
          console.log(result);
        });
        
        //
        // -- INITIALIZING MAP --
        //
        $scope.$on(EVENTS.MAPLOADED, function() // Map fully loaded
        {
          usersInfo.forEach(function(info)
          {
            $scope.$broadcast(EVENTS.ADDUSER, {fullName:info.surname+" "+info.name, location:info.pos, img:info.img}); // To child
          });
        });
        
        //
        // -- USER INTERACTION --
        //
        $scope.subCategory = undefined;
        
        $scope.catMenuClick = function(cat)
        {
          if (cat == undefined)
          {
            $scope.categories = getKeys(servCategories);
            $scope.subCategory = cat;
          }
          else if (servCategories.hasOwnProperty(cat))
          {
            $scope.categories = getKeys(servCategories[cat]);
            $scope.subCategory = cat;
          }
        }
      }])
  });
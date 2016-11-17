'use strict';

angular.module('mapContainer')
  .component('mapContainer',
  {
    templateUrl:
      'components/map-container/map-container.template.html',
    controller:
      ('mapContainerController',
      ['$scope', 'EVENTS',
      function ($scope, EVENTS)
      {
        //
        // -- MAP INITIALIZATION --
        //
        var mapOptions =
        {
          zoom: 11,
          center: new google.maps.LatLng(46.214276, 6.154324)
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        var infoWindows = [];
        var markers = [];
        
        // Fully loaded event
        google.maps.event.addListenerOnce(map, 'idle', function()
        {
          $scope.$emit(EVENTS.MAPLOADED);// Send signal to parent
        });
        
        //
        // -- MAP FUNCTIONS --
        //
        function addUserMarker(userLocation, userFullName)
        {
          var marker = new google.maps.Marker(
          {
            position: new google.maps.LatLng(userLocation[0],userLocation[1]),
            title: userFullName,
            map: map
          });
          
          var infoWindow = new google.maps.InfoWindow(
          {
            content: userFullName
          });

          marker.addListener("click", function()
          {
            infoWindows.forEach(function(iw)
            {
              iw.close();
            });
            infoWindow.open(map, marker);
          });
          
          markers.push(marker);
          infoWindows.push(infoWindow);
        }
        
        // Called from parent
        $scope.$on(EVENTS.ADDUSER, function(event, args)
        {
          addUserMarker(args.location, args.fullName);
        });
      }])
  });
//model for locations

        var locations=[
        {
        title:'nelliyampathy',
        location:{lat:10.5354,lng:76.6936}
    },
        {
            title:'vadakunnathan',
            location:{lat:10.5243,lng:76.2135}
    },
        {
            title:'kerala police accademy',
            location:{lat:10.5686,lng:76.2339}},
        {
            title:'Parambikulam',
            location:{lat:10.3929,lng:76.7756}
        },
        {
            title:'Thrissur zoo',
            location:{lat:10.5307,lng: 76.2212}
        },
        {
            title:'Chimminy wild life',
            location:{lat:10.4310,lng: 76.4910}
        },
         {
            title:'Peechi Dam',
            location:{lat:10.5301,lng:76.3699}
        },
         {
            title:'Peechi-Vazhani Wild life sanctuary',
            location:{lat:10.4834,lng: 76.4332}
        },
         {
            title:'Sholayar Reserve forest',
            location:{lat:10.3576,lng: 76.5719}
        }
    ];



    var map;
    var markers = [];
    function initMap(){
        var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

        map = new google.maps.Map(document.getElementById('map'),{
            center:{lat:10.5276,lng:76.2144},
            zoom:13,
            styles:styles,
            mapTypeControl:false
        });




        var largeInfoWindow =new google.maps.InfoWindow();
         var defaultIcon = makeMarkerIcon('0091ff');
        var highlightedIcon = makeMarkerIcon('FFFF24');


        for(var i=0;i<locations.length;i++){
            var position = locations[i].location;
            var title = locations[i].title;
            var marker = new google.maps.Marker({
                map:map,
                position:position,
                title:title,
                animation:google.maps.Animation.DROP,// to animate markers drop down
                icon:defaultIcon,
                id:i
            });

        markers.push(marker);
        marker.addListener('click',function(){
            populateInfoWindow(this,largeInfoWindow);
            loadData(this,position);
        });

        function loadData(marker,title) {
    var $wikiElem = $('#wikipedia-links');
    $wikiElem.text(" ");
         var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikiCallback';
var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text("failed to load wikipedia resources");
    alert("please load later");
    },8000);// to check when not loaded

    $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        success:function(response){
            var articleList =response[1];
            for(var i=0; i<articleList.length;i++){
                articleStr =articleList[i];
                var url='http://en.wikipedia.org/wiki/'+ articleStr;
                $wikiElem.append('<li><a href="'+url+ '">'+articleStr+'</a></li>');
            }
                    clearTimeout(wikiRequestTimeout);
        }
    })
        return false;

};




      marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
            this.setAnimation(google.maps.Animation.BOUNCE);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
            this.setAnimation(google.maps.Animation.NULL);

          });
      }

        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
}

        function populateInfoWindow(marker,infowindow){
        if(infowindow.marker!=marker){
            infowindow.marker=marker;
            infowindow.setContent('<div>'+marker.title+'</div>');
            infowindow.open(map,marker);

            infowindow.addListener('closeclick',function(){
            infowindow.marker=null;
        });

          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      }

     function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }
            function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }
            function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }

var Location = function(data){
        this.title =ko.observable(data.title);
        this.location = ko.observable(data.location);
      };

var ViewModel = function(){
    var self= this;
         self.filter = ko.observable(' ');

    this.placesArray = ko.observableArray([]);
     locations.forEach(function(locItem){
        self.placesArray.push(new Location(locItem));
    });

     self.filteredItems = ko.computed(function() {

    var filter = this.filter().toLowerCase();
    if (!filter) {
        // for(var i=0;i<locations.length;i++)
        return self.placesArray;
    } else {
        return ko.utils.arrayFilter(self.placesArray(), function(item) {
                var name = item.title.toLowerCase().indexOf(filter)!==-1;
                return name;
        });
    }
}, self);


 };



ko.applyBindings(new ViewModel());


// self.filteredItems = ko.computed(function() {
//          this.filter = ko.observable(' ');

//     var filter = this.filter().toLowerCase();
//     if (!filter) {
//         for(var i=0;i<placesArray.length;i++)
//         return this.placesArray[i];
//     } else {
//         return ko.utils.arrayFilter(self.placesArray(), function(item) {
//                 var name = item.title.toLowerCase();
//                 var check = name.indexOf(filter)!==-1;
//                                 item.marker.setVisible(check);

//                 return check;
//         });
//     }
// }, this);






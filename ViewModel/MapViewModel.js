function MapViewModel() {

    let latitude = 56.162939//54.912916; //55.040852
    let longitude = 10.203921//9.784347; //9.415158900000051

    this.neighborhoodName = ko.observable(" Lat Long Restaurants");
    this.neighborhoodCoordinates = ko.observable("Latitude is: " + latitude + " and Longitude is: " + longitude);

    // Creates the map and saves the map onto the map variable, so I can reference it later if needed. 
    var map = LoadMap(latitude, longitude);
    // Saves all current data (this) into self for later use
    var self = this;

    // Creates the ALL option for the dropdown menu
    self.availableTypes = ko.observableArray(['All']);

    // makes markers an observablearray to look for changes in the listview 
    self.Markers = ko.observableArray();

    // Get locations from Foursquare based on starting location. The first parameter is a function that loads the results from the foursquare query into the map.  
    GetLocations(LoadLocations, latitude, longitude);

    
    // This function loads the map and set the default startinglocation and zoomlevel. Using the Google Maps API. 
    function LoadMap(latitude, longitude) {

        let cameraCenter = { lat: latitude, lng: longitude };

        let map = new google.maps.Map(document.getElementById('map'), {
            center: cameraCenter,
            zoom: 14,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false
        });
        console.log('Empty Map loaded!');

        return map;
    }


    function LoadLocations(foursquareData) {
        let locations = [];

        // Source: https://developer.foursquare.com/docs/api/venues/search 
        // foursquareData is the result from the ajax request. 
        foursquareData.response.venues.forEach(venue => {

            let category = new LocationType(venue.categories[0].name, venue.categories[0].id);
            let newLocation = new Location(venue.name, venue.location.lat, venue.location.lng, category, venue.url);

            // pushes the new object into an array. 
            locations.push(newLocation);

            // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes 
            // Source: http://knockoutjs.com/documentation/observableArrays.html 
            // Makes sure that available types don't have dublicates. 
            if (self.availableTypes.indexOf(category.Name) == -1) {
                // Adds the new categories to the option dropdown manu. 
                self.availableTypes.push(category.Name);
                
            }
        });
        // sorts the dropdown menu. 
        self.availableTypes.sort();


        // Loads the markers in the screen for each marker there is 
        LoadMarkers(locations, map).forEach(marker => {
            self.Markers.push(marker);
        });

        // When the dropdown is changed a trigger to hide the nonselected categories are called
        $("select").change(function () {
            let selectedCategory = $("select option:selected").text();

            // Source: https://stackoverflow.com/questions/34511926/how-to-iterate-an-knockout-observablearray-length-0 
            self.Markers().forEach(marker => {

                if (marker().Location.Type.Name != selectedCategory && selectedCategory != 'All') {
                    marker().Hide();
                }
                else {
                    marker().Show();
                }
            });
        });
    }

    // Source: https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple
    // adds data to each marker  
    function LoadMarkers(locations, map) {
        let markers = [];
        var infowindow = new google.maps.InfoWindow();
        locations.forEach(location => {
            // Makes new marker observable to look for change in state.
            let marker = ko.observable(new Marker(location, map, infowindow));
            markers.push(marker);
        });
        console.log('Markers loaded!');

        return markers;
    }
    // a function that maintains the information on each marker. 
    function Marker(location, map, infoWindow) {
        let self = this;
        this.Location = location;
        this.Visible = ko.observable(true);

        // Source: https://developers.google.com/maps/documentation/javascript/markers
        let title = location.Title;
        let marker = new google.maps.Marker({
            position: { lat: location.Latitude, lng: location.Longitude },
            map: map,
            title: title,
            // Source: https://stackoverflow.com/questions/8248077/google-maps-v3-standard-icon-shadow-names-equiv-of-g-default-icon-in-v2
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            // Source: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
            animation: google.maps.Animation.DROP

        });

        // function that adds text to the infobox
        this.ShowInfobox = function () {
            let info = '<h1>' + title + '</h1>';
            console.log(location.Url);
            if(location.Url == undefined){
                info += '<a>The Restaurant dont have a website</a>';
            }
            else {
                info += '<a href=' + location.Url + '>' + 'Link to their website</a>';
            }
            infoWindow.setContent(info);
            //marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            self.Bounce();
            infoWindow.open(map, marker);
        };
        marker.addListener('click', this.ShowInfobox);

        // Animation
        this.Drop = function () {
            marker.setAnimation(google.maps.Animation.DROP);
        };
        // Animation
        this.Bounce = function () {
            //Source: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
            marker.setAnimation(google.maps.Animation.BOUNCE);
            // A set timeout function stops the animation
            //Source: https://stackoverflow.com/questions/14657779/google-maps-bounce-animation-on-marker-for-a-limited-period 
            setTimeout(function () {
                marker.setAnimation(null)
            }, 1000);
        };
        // function that hides the marker on the map and the viewlist 
        this.Hide = function () {
            infoWindow.close();
            this.Visible(false);
            marker.setVisible(false);
        };
        // function that shows the marker on the map and the viewlist 
        this.Show = function () {
            this.Visible(true);
            marker.setVisible(true);
        };
    }
}
function MapError(){
    console.log("Google API Failed");
    alert("Google Maps did not load");
}

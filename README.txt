Hello 
The purpose of this webapplication is to show local restaurant near my hometown of Sønderborg. 
Change the lat lng coordinates if you want. If should work anywhere. 

This app uses the Google Maps API and Foursquare API to get data and map information. 

Knockout is used to controll the interface using the view model
CSS grid is used for practicing something different.  

How to use: 
Open the index file to run the application. 

Positions will be shown on the map and in a listview. If you click on either of them, an infoscreen will be shown with restaurant name and website url (if available)

If you select the dropdown on the left side you can filter to more specific restaurant categories, and the map and list will be updated. 

How it works. 
The program starts by initilizing the MapViewModel script

LoadMap loads the map using the google maps api and sets the starting coordinates. 

GetLocations will make a search in the Foursquare API based on the starting coordinates.

LoadLocation takes the results from Foursquare and adds it to the map. 





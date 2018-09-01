const CLIENT_ID = 'IABZW4IRFCMH0YLUHX5UPRG13QT4BP02IMOXZNQTVLYG21S2';
const CLIENT_SECRET ='FFBBYP2W44CNQDVCHTTAJIPJTDXZRE24VDVGAMX10SF3Q1YB';
const address = 'https://api.foursquare.com/v2/venues/';

// Makes a search for location based on starting location. Category is limited to the category "Food" in foursquare API.
function GetLocations(onComplete, latitude, longitude){
    let location = 'll=' + latitude + ',' + longitude;
    let radius = 'radius=3000';
    let parameters = [location,'categoryId=4d4b7105d754a06374d81259',radius];
    GetData('search', onComplete, parameters);
}

function GetData(searchType, onComplete, parameters ){
    let query = '';
    // only ads parameters if there is any
    if (parameters !== null){
        // Makes the array into one query string
        parameters.forEach(parameter => {
            query += '&'+parameter; 
        });
    }
    // Source: https://developer.foursquare.com/docs/api/getting-started 
    // Makes a request to foursqare with the search queries.  
    $.ajax({
        url: address + searchType,
        dataType: 'json',
        data: 'limit=50' +
                '&client_id=' + CLIENT_ID +
                '&client_secret=' + CLIENT_SECRET +
                '&v=20180101' +
                query,
        async: true,
        error: function(){
            alert("Error: The map did not load!");
        },
        // onComplete is called when the foursquare API has responded with some data. In this program it is a reference to LoadLocation. 
        success: onComplete
    });
}





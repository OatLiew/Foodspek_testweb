/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

$(function(){
	$('.message').html('Loading... <img src="img/loading.gif">');
	getQuakes();

});

function getQuakes(){

	$.getJSON(gov.usgs.quakesUrl, function(quakes){
	    //quakes is an array of objects, each of which represents info about a quake
	    //see data returned from:
	    //https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi

	    //set our global variable to the current set of quakes
	    //so we can reference it later in another event
	    gov.usgs.quakes = quakes;

	    $('.message').html('Display ' + quakes.length + ' earthquakes');

	    gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
	    center: new google.maps.LatLng(0,0),        //centered on 0/0
	    zoom: 2,                                    //zoom level 2
	    mapTypeId: google.maps.MapTypeId.TERRAIN,   //terrain map
	    streetViewControl: false                    //no street view
		});

		addQuakeMarkers(quakes, gov.usgs.quakesMap);

	}); //handle returned data function

}

function addQuakeMarkers(quakes, map){

	var quake;
	var idx;
	var infoWindow;

	for(idx = 0; idx < 20; ++idx){	
		quake = quakes[idx];

		if(quake.location){
			//assuming that the variable 'quake' is set to 
			//the current quake object within the quakes array...
			quake.mapMarker = new google.maps.Marker({
			    map: map,
			    raiseOnDrag: true,
			    animation: google.maps.Animation.DROP,
			    position: new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
			});
		
			infoWindow = new google.maps.InfoWindow({
		    content: new Date(quake.datetime).toLocaleString() + 
		                ': magnitude ' + quake.magnitude + ' at depth of ' + 
		                quake.depth + ' meters'
			});
			registerInfoWindow(map, quake.mapMarker, infoWindow);


		}
	}

	for(idx = 20; idx < quakes.length; ++idx){	
		quake = quakes[idx];

		if(quake.location){
			//assuming that the variable 'quake' is set to 
			//the current quake object within the quakes array...
			quake.mapMarker = new google.maps.Marker({
			    map: map,
			    raiseOnDrag: true,
			    //animation: google.maps.Animation.DROP,
			    position: new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
			});

			infoWindow = new google.maps.InfoWindow({

		    content: new Date(quake.datetime).toLocaleString() + 
		                ': magnitude ' + quake.magnitude + ' at depth of ' + 
		                quake.depth + ' meters'
			});
			registerInfoWindow(map, quake.mapMarker, infoWindow);

		}
	}
}

function registerInfoWindow(map, marker, infoWindow) {


    google.maps.event.addListener(marker, 'click', function(){
 	
 		if(gov.usgs.iw){
	    	gov.usgs.iw.close();
		}	   	

        gov.usgs.iw = infoWindow;
        infoWindow.open(map, marker);
    });                
} //registerInfoWindow()



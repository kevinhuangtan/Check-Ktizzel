// CONSTANTS////////
var WEEKDAY = new Array(7);
WEEKDAY[0]=  "SUN";
WEEKDAY[1] = "MON";
WEEKDAY[2] = "TUE";
WEEKDAY[3] = "WED";
WEEKDAY[4] = "THU";
WEEKDAY[5] = "FRI";
WEEKDAY[6] = "SAT";

var MONTH = new Array(12);
MONTH[0] = "JAN"
MONTH[1] = "FEB"
MONTH[2] = "MAR"
MONTH[3] = "APR"
MONTH[4] = "MAY"
MONTH[5] = "JUN"
MONTH[6] = "JUL"
MONTH[7] = "AUG"
MONTH[8] = "SEP"
MONTH[9] = "OCT"
MONTH[10] = "NOV"
MONTH[11] = "DEC"

Template.eventTitle.onRendered(function(){
	document.title = "Create Event"

	delete Session.keys['eventSession']
	return 0
});


Template.eventTitle.events({
	'submit form': function(event){
		event.preventDefault()
		var eventName = event.target.eventName.value;
		var eventDescription = event.target.description.value;
		var user = Meteor.user();
		var userName;
		var userOrganization;
		if(user.profile){
			userName = user.profile.fullname
			userOrganization = user.profile.organization
		}
		else{
			userName = ""
			userOrganization = ""
		}
		var eventHost = {'name': userName, 'email':user.emails[0].address, 'organization': userOrganization}
		var attending = [];
		attending.push(Meteor.userId());
		var eventSession = {'name': eventName, 'host': Meteor.userId(), 'host_info':eventHost, 'attending': attending, 'description': eventDescription}
		Session.set('eventSession', eventSession)
		Router.go('eventDateAndTime');
	}
});
Template.eventDateAndTime.events({
	'submit form': function(event){
		var target = event.target
		event.preventDefault()
		var startPM = 0;
		var endPM = 0;
		if (target.startAmpm.value == "PM"){
			startPM = startPM + 12
		}
		if (target.endAmpm.value == "PM"){
			endPM = endPM + 12
		}
		var month = Number(target.month.value) - 1
		var date = Number(target.date.value) + 1
		var startDate = new Date(target.year.value, month, date, Number(target.startHour.value) + startPM, target.startMinute.value);
		var endDate = new Date(target.year.value, month, date, Number(target.endHour.value) + endPM, target.endMinute.value);
		var eventSession = Session.get('eventSession');

		///parsing
		var weekday = startDate.getDay()
		var options = {hour:'2-digit', minute:'2-digit' };
		var startTime = startDate.toLocaleTimeString('en-US',options).toString();
		var endTime = endDate.toLocaleTimeString('en-US',options).toString();
		

		var startDateParse = startDate.toLocaleDateString();
		var endDateParse = endDate.toLocaleDateString();
		if(startDateParse = endDateParse){
			eventSession['dateParsed'] = WEEKDAY[weekday] + ', ' + MONTH[month] + ' '+ date + ', ' + startTime + ' - ' + endTime
		}
		else{
			var endDay = weekday[eventSession.endDate.getDay()]
			eventSession['dateParsed'] = WEEKDAY[weekday] + ', ' + MONTH[month] + ' '+ date + ', ' + startTime + ' - ' + endDay + ' ' + endTime
		}


		eventSession['startDate'] = startDate;
		eventSession['endDate'] = endDate;
		Session.set('eventSession', eventSession)
		Router.go('eventLocation');
	}
});
Template.eventLocation.events({
	'submit form': function(event){
		event.preventDefault()
		var eventPlace = event.target.eventPlace.value;
		var location = {lat: Number(event.target.latFld.value), lng: Number(event.target.lngFld.value)}
		var eventSession = Session.get('eventSession')
		var id = checkEvents.insert({
			name: eventSession['name'],
			host: eventSession['host'],
			host_info: eventSession['host_info'],
			attending: eventSession['attending'],
			dateParsed: eventSession['dateParsed'],
			description: eventSession['description'],
			startDate: eventSession['startDate'],
			endDate: eventSession['endDate'],
			place: eventPlace,
			geoLocation: location
		});			
		Session.set("currentEvent", id);
		Router.go('event');
	}
});

Template.eventLocation.onRendered(function(){
	var map;
    var markersArray = [];
    var geoLocation = Session.get('geoLocation') || { lat: 40.7, lng: -74 };
	function initialize() {
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions = {
          center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions)
    	google.maps.event.addListener(map, "click", function(event)
        {
            // place a marker
            placeMarker(event.latLng);

            // display the lat/lng in your form's lat/lng fields
            document.getElementById("latFld").value = event.latLng.lat();
            document.getElementById("lngFld").value = event.latLng.lng();
        });
	}

    function placeMarker(location) {
        // first remove all markers if there are any
        deleteOverlays();

        var marker = new google.maps.Marker({
            position: location, 
            map: map
        });

        // add marker in markers array
        markersArray.push(marker);

        //map.setCenter(location);
    }

    // Deletes all markers in the array by removing references to them
    function deleteOverlays() {
        if (markersArray) {
            for (i in markersArray) {
                markersArray[i].setMap(null);
            }
        markersArray.length = 0;
        }
    }
    initialize();
});
/*GoogleMaps.init({
  'sensor': false, //optional
  'key': 'AIzaSyA3IaCGmNfltsyk5fyATz-icw-D5VFhSYw',
  'language': 'en',  //optional
  'libraries': 'geometry,places'
});*/

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
	Session.set('currentPage', 'createEvent')
});
Template.eventDateAndTime.onRendered(function(){
	document.title = "Date and Time"
	Session.set('currentPage', 'createEvent')
});
Template.eventLocation.onRendered(function(){
	document.title = "Location"
	Session.set('currentPage', 'createEvent')
	Session.set('address', 'Locate On Map')
});


Template.eventTitle.events({
	myLocation: function () {
		// return 0, 0 if the location isn't ready
		if(Geolocation.latLng()){
			Session.set('geoLocation', Geolocation.latLng());
		}
		return;
	},
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
		var eventHost = {'name': (userName || ""), 'email':user.emails[0].address, 'organization': (userOrganization || "")}
		var attending = [];
		attending.push(Meteor.userId());
		var eventSession = {'name': eventName, 'host': Meteor.userId(), 'host_info':eventHost, 'attending': attending, 'description': eventDescription}
		Session.set('eventSession', eventSession)
		Router.go('eventDateAndTime');
	},
	'click #delete':function(){
		Router.go('splash')
	},
	'click #next':function(){
		Router.go('eventDateAndTime')
	}

});
Template.eventDateAndTime.helpers({
	myLocation: function () {
		// return 0, 0 if the location isn't ready
		if(Geolocation.latLng()){
			geoLocation = Geolocation.latLng()
			Session.set('geoLocation', geoLocation);
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
		}
		// console.log(Geolocation.latLng())
		return Geolocation.latLng() || { lat: 0, lng: 0 };
	}
})


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
	},
	'click #back':function(){
		Router.go('eventTitle')
	}
	,
	'click #next':function(){
		Router.go('eventLocation')
	}
});
Template.eventLocation.events({
	'submit form': function(event){
		event.preventDefault()
		var eventPlace = event.target.eventPlace.value;
		var location = Session.get('createEventLocation');
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
		var hostEvents = []
		if(Meteor.user().profile.hostEvents){
			hostEvents = Meteor.user().profile.hostEvents
		}
		hostEvents.push(id)

		Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.hostEvents": hostEvents}});
			
		Session.set("currentEvent", id);
		Router.go('event');
	},
	'click .map-container':function(event){
		event.preventDefault()
		var lat = Number(document.getElementById("latFld").value)
		var lng = Number(document.getElementById("lngFld").value)
		var js;
		var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyA3IaCGmNfltsyk5fyATz-icw-D5VFhSYw';
		var cityName0;
		var cityName;
		$.ajaxSetup({
		   async: false
		});
		$.getJSON(url, function(data) {
				js = data;
				cityName0 = js.results[0].address_components[1].long_name;
				cityName = js.results[0].address_components[2].long_name;
				cityName1 = js.results[0].address_components[3].long_name;

		});
		var result = cityName0 + ', '+cityName + ', ' + cityName1;
		
		Session.set('address', result)

	},
	'click #back':function(){
		Router.go('eventDateAndTime')
	}
});

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.eventLocation.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        geoLocation = Session.get('geoLocation') || {lat: 0, lng: 0};

        return {
          // center: new google.maps.LatLng(-37.8136, 144.9631),
           center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
        };
      }
    },
    devGeolocation:function(){
      return Session.get('devGeolocation');
    }
  });
  Template.eventLocation.onRendered(function(){
      var location = Session.get('geoLocation');
      Session.set('devGeolocation', location)
  })
 
  Template.eventLocation.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
      // Session.set('currentMarker', marker);
 

      google.maps.event.addListener(map.instance, 'click', function(event) {
      	document.getElementById("latFld").value = event.latLng.lat();
        document.getElementById("lngFld").value = event.latLng.lng();
        Session.set('createEventLocation', { lat: event.latLng.lat(), lng: event.latLng.lng() })
        marker.setMap(null);
        marker = new google.maps.Marker({
          position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
          map: map.instance
         });

      });
    });
  });
}





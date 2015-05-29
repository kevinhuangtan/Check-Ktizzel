
Router.map(function() {
	this.route("splash", {path: '/'});
	this.route("event", {path: '/event'});
	this.route("createEvent", {path: '/createEvent'});
	this.route("checkIn", {path: '/checkIn'});
	this.route("scrollEvents", {path: '/scrollEvents'});
	this.route("profile", {path: '/profile'});

});

if (Meteor.isClient) {
	Meteor.subscribe("userData");
	Meteor.subscribe("events");


//////////////////USERS///////////////////////
	Template.profile.helpers({
		'email': function(){
			document.title = "My Profile";
			var user = Meteor.user();
			return user.emails[0].address;

		},
		'name' : function(){
			return Meteor.user().profile.name;
		},
		'gender' : function(){
			return Meteor.user().profile.gender;
		},
		'phone' : function(){
			return Meteor.user().profile.phone;
		},
		'ethnicity' : function(){
			return Meteor.user().profile.ethnicity;
		},
		'organization' : function(){
			return Meteor.user().profile.organization;
		}
	});

	Template.profile.events({
		'click .update': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.name": event.target.name.value,"profile.gender": event.target.gender.value,"profile.phone": event.target.phone.value,"profile.ethnicity": event.target.ethnicity.value,"profile.organization": event.target.organization.value} });
		},

		'click #gender': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.gender": ""} });
		},
		'click #phone': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.phone": "adfafa"} });
		},
		'click #ethnicity': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.ethnicity": ""} });
		},
		'click #organization': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.organization": ""} });
		}
	});
	Template.splash.helpers({
		myLocation: function () {
			// return 0, 0 if the location isn't ready
			return Geolocation.latLng() || { lat: 0, lng: 0 };
		},
		'checkEvent': function(){
			return checkEvents.find().fetch(); 
		},
		'nearbyEvents' : function(){
			var locations = checkEvents.find().fetch(); 
			var nearbyLocations = []
			var delta_x = 0;
			var delta_y = 0;
			for (var i = 0; i < locations.length; i++ ){
				delta_x = Geolocation.latLng().lng - locations[i].location[0]
				delta_y = Geolocation.latLng().lat - locations[i].location[1]

				if ((delta_x*delta_x + delta_y*delta_y) < 10*10 ){
					nearbyLocations.push(locations[i]);
				}
			}
			return checkEvents.find().fetch(); 
		},
		'myevents': function(){
			var currentUserId = Meteor.userId();
			return checkEvents.find().fetch()
			// return checkEvents.find({createdby: Meteor.userId()});
		},
		'myCity' : function(){
			var js;
			var loc = Geolocation.latLng();
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+loc.lat+','+loc.lng+'&key=AIzaSyA3IaCGmNfltsyk5fyATz-icw-D5VFhSYw';
			var cityName;
			var cityName2;
			$.ajaxSetup({
			   async: false
			});
			$.getJSON(url, function(data) {
   				js = data;
   				// console.log(js.results[0].address_components[3])
   				cityName = js.results[0].address_components[3].long_name;
   				cityName2 = js.results[0].address_components[4].long_name;
    			// you can even pass data as parameter to your target function like myFunct(data);
			});
			var result = cityName + ', ' + cityName2;
			return result 
		}
	});
	Template.splash.events({
		'click .event-li': function(event){
			Session.set("currentEvent", this._id);
			Router.go('event');
		}
	});

////////////////EVENTS////////////////////////
	Template.createEvent.events({
		'submit form': function(event){
			console.log('submit');
			event.preventDefault();
			var eventName = event.target.eventName.value;
			var eventDate = event.target.eventDate.value;
			var eventGeolocation = Geolocation.latLng();
			var eventArea = event.target.eventArea.value;
			var eventLocation = event.target.eventLocation.value;
			var eventHost = Meteor.userId();
			var attending = [];
			attending.push(eventHost);
			checkEvents.insert({
				name: eventName,
				date: eventDate,
				geoLocation: eventLocation,
				eventArea: eventArea,
				location: eventLocation,
				createdby: Meteor.userId(),
				attending: attending
			});
		}
	});
	Template.createEvent.helpers({
		'myevents': function(){
			var currentUserId = Meteor.userId();
			return checkEvents.find().fetch()
			// return checkEvents.find({createdby: Meteor.userId()});
		}
	});

	Template.createEvent.onRendered(function () {
	  // Use the Packery jQuery plugin
		function initialize() {
	        var mapCanvas = document.getElementById('map-canvas');
	        var mapOptions = {
	          center: new google.maps.LatLng(44.5403, -78.5463),
	          zoom: 8,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        }
	        console.log('here')
	        var map = new google.maps.Map(mapCanvas, mapOptions)
    	}
      	google.maps.event.addDomListener(window, 'load', initialize);	
	});

	Template.event.helpers({
		'currentEvent' : function(){
			var id = Session.get("currentEvent")

			var result = checkEvents.findOne({_id: "Qoiqqee4AbZdo3Tnn"})
			console.log(result)
			return result		
		},
		'attendees' : function(){
			var result = checkEvents.findOne({_id: "Qoiqqee4AbZdo3Tnn"})
			var attendees = []
			for (var i = 0; i < result.attending.length; i++){
				attendees.push(Meteor.users.findOne({_id: result.attending[i]}).emails[0].address)
			}
			return attendees
		}
	});





////////////////END////////////////////////

	Template.testingZone.helpers({
		'user': function(){

			return Meteor.users.find().fetch()
		}
	})

		//Map
	Template.checkIn.helpers({
		loc: function () {
			// return 0, 0 if the location isn't ready
			return Geolocation.latLng() || { lat: 0, lng: 0 };
		},
		error: Geolocation.error
	});


		// checkEvents.insert({ name: "Bob", date: 03/04/15, time: 22:00})

	// Meteor.user().services.facebook.name
	// Geolocation.currentLocation().coords.latitude

}


//------------------------------------------------------------//

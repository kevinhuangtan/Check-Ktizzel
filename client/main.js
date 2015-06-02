
Router.map(function() {
	this.route("splash", {path: '/'});
	this.route("event", {path: '/event'});
	this.route("createEvent", {path: '/createEvent'});
	this.route("checkIn", {path: '/checkIn'});
	this.route("scrollEvents", {path: '/scrollEvents'});
	this.route("profile", {path: '/profile'});

});

if (Meteor.isClient) {
	// Meteor.subscribe("userData");
	 Meteor.subscribe("allUserData");



////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////USERS//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
	Template.profile.helpers({
		email: function(){
			document.title = "My Profile";
			var user = Meteor.user();
			return user.emails[0].address;
		},
		name : function(){
			return Meteor.user().profile.fullname;
		},
		gender : function(){
			return Meteor.user().profile.gender;
		},
		phone : function(){
			return Meteor.user().profile.phone;
		},
		ethnicity : function(){
			return Meteor.user().profile.ethnicity;
		},
		organization : function(){
			return Meteor.user().profile.organization;
		}
	});


	Template.profile.events({
	    'click .edit' : function() {
	        Session.set('edit', true);
	    }
	});

	Template.profile.editme = function () {
	    return Session.get('edit');
	};


	Template.profile.events({
		'submit .profile-form': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.fullname": event.target.name.value,"profile.gender": event.target.gender.value,"profile.phone": event.target.phone.value,"profile.ethnicity": event.target.ethnicity.value,"profile.organization": event.target.organization.value} });
		}
	});

	Template.splash.helpers({
		myLocation: function () {
			// return 0, 0 if the location isn't ready
			return Geolocation.latLng() || { lat: 0, lng: 0 };
		},
		checkEvent: function(){
			return checkEvents.find().fetch(); 
		},
		eventYourAt : function(){

		},
		nearbyEvents : function(){
			var locations = checkEvents.find().fetch(); 
			var nearbyLocations = []
			var delta_x = 0;
			var delta_y = 0;
			for (var i = 0; i < locations.length; i++ ){
				delta_x = Geolocation.latLng().lng - locations[i].geoLocation.lng
				delta_y = Geolocation.latLng().lat - locations[i].geoLocation.lat
				// 2 miles * (1 minute/1.15 miles) * (1 degree/60 minute) 
				if ((delta_x*delta_x + delta_y*delta_y) < .029 ){
					nearbyLocations.push(locations[i]);
				}
			}
			return nearbyLocations; 
		},
		myevents: function(){
			return checkEvents.find().fetch()
			// return checkEvents.find({createdby: Meteor.userId()});
		},
		myCity : function(){
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

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////EVENTS//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
	
	Template.createEvent.events({
		'submit form': function(event){
			event.preventDefault()
			var eventName = event.target.eventName.value;
			var eventDate = event.target.eventDate.value;
			var eventPlace = event.target.eventPlace.value;
			var eventHost = Meteor.userId();
			var attending = [];
			var geoLocation = Geolocation.latLng();///target
			var location = {lat: Number(event.target.latFld.value), lng: Number(event.target.latFld.value)}
			attending.push(eventHost);
			checkEvents.insert({
				name: eventName,
				date: eventDate,
				geoLocation: geoLocation,
				place: eventPlace,
				createdby: Meteor.userId(),
				attending: attending,
			});
			var currEvent = checkEvents.findOne({name: eventName})
			Session.set("currentEvent", currEvent._id);
			Router.go('event');
		}
	});
	Template.createEvent.helpers({
		loc: function () {
		  // return 0, 0 if the location isn't ready
		  return Geolocation.latLng() || { lat: 0, lng: 0 };
		},
		error: Geolocation.error,
		myevents: function(){
			var currentUserId = Meteor.userId();
			return checkEvents.find().fetch()
			// return checkEvents.find({createdby: Meteor.userId()});
		}
	});

	Template.createEvent.onRendered(function () {
	  // Use the Packery jQuery plugin
	 	var map;
        var markersArray = [];
      	// var geoLocation = [lat: Session.get('lat'), lng: Session.get('lng')]
		function initialize() {
	        var mapCanvas = document.getElementById('map-canvas');
	        var mapOptions = {
	          center: new google.maps.LatLng(44.5,-78.5),
	          zoom: 8,
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
      	google.maps.event.addDomListener(window, 'load', initialize);	
	});

	Template.event.helpers({
		currentEvent : function(){
			var id = Session.get("currentEvent")

			var result = checkEvents.findOne({_id: Session.get("currentEvent")})
			// console.log(result)
			return result		
		},
		attendees : function(){
			var result = checkEvents.findOne({_id: Session.get("currentEvent")})
			var attendees = []
			var attendee;
			var email;
			var email2;
			for (var i = 0; i < result.attending.length; i++){
				attendee = result.attending[i];
				// attend.ees.push(attendee);   
				email = Meteor.users.findOne({_id: attendee});
				email2 = email.emails[0].address

				attendees.push(email2);
			}
			return attendees
		},
		checkedIn: function(){
			var result = checkEvents.findOne({_id: Session.get("currentEvent")})
			if(result.attending.indexOf(Meteor.userId())!=-1 && Meteor.user()){
				return true
			}
			else{
				return false
			}
		}
	});
	Template.event.events({
		'click .checkIn':function(){
			var eventId = Session.get("currentEvent")
			// console.log(eventId);
			checkEvents.update({_id: eventId}, {$push: {attending: Meteor.userId()}});
			// console.log(checkEvents.findOne({_id: "Qoiqqee4AbZdo3Tnn"}).attending)
		}
	})




////////////////END////////////////////////


}


//------------------------------------------------------------//

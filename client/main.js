Router.map(function() {
	this.route("splash", {path: '/'});
	this.route("event", {path: '/event'});
	this.route("eventTitle", {path: '/createEvent'});
	this.route("eventDateAndTime", {path: '/eventDateAndTime'});
	this.route("eventLocation", {path: '/eventLocation'});
	this.route("checkIn", {path: '/checkIn'});
	this.route("scrollEvents", {path: '/scrollEvents'});
	this.route("profile", {path: '/profile'});

});
function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  // var d  = 5
  return d.toFixed(1);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

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
			Session.set('geoLocation', Geolocation.latLng());
			return Geolocation.latLng() || { lat: 0, lng: 0 };
		},
		checkEvent: function(){
			return checkEvents.find().fetch(); 
		},
		eventYourAt : function(){

		},
		nearbyEvents : function(){
			var locations = checkEvents.find().fetch(); 
			var myGeolocation = Geolocation.latLng() || {'lat':0, 'lng':0};
			var nearbyLocations = []
			var delta_x = 0;
			var delta_y = 0;
			for (var i = 0; i < locations.length; i++ ){
				var locGeolocation = locations[i].geoLocation || {'lat':0, 'lng':0}
				delta_x = myGeolocation.lng - locGeolocation.lng
				delta_y = myGeolocation.lat - locGeolocation.lat
					// 2 miles * (1 minute/1.15 miles) * (1 degree/60 minute) 
				if ((delta_x*delta_x + delta_y*delta_y) < .1 ){
					locations[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);
					nearbyLocations.push(locations[i]);
				}
			}
			console.log('Nearby Events:')			
			console.log(nearbyLocations)
			return nearbyLocations; 
		},
		myevents: function(){
			console.log('All Events:')
			console.log(checkEvents.find().fetch())
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





////////////////END////////////////////////

}


//------------------------------------------------------------//

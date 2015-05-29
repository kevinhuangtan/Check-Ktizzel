
Router.map(function() {
	this.route("home", {path: '/'});
	this.route("viewEvent", {path: '/viewEvent'});
	this.route("createEvent", {path: '/createEvent'});
	this.route("checkIn", {path: '/checkIn'});
	this.route("scrollEvents", {path: '/scrollEvents'});
	this.route("users", {path: '/users'});
	this.route("profile", {path: '/profile'});
});


checkEvents = new Mongo.Collection("checkEvents");

if (Meteor.isClient) {
	Meteor.subscribe("userData");



//////////////////USERS///////////////////////
	Template.users.helpers({
		'user': function(){
			console.log(Meteor.user())
			return Meteor.users.find().fetch()
		}
	});
	Template.profile.helpers({
		'email': function(){
			var user = Meteor.user();
			return user.emails[0].address;

		},
		'profpic' : function(){
			return Meteor.user().profile.pic;
		}
	});

	Template.profile.events({
		'submit .profile-form': function(event){
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.pic": 'profpic'} });
		}
	});


////////////////EVENTS////////////////////////
	Template.createEvent.events({
		'submit form': function(event){
			event.preventDefault();
			var eventName = event.target.eventName.value;
			var eventDate = event.target.eventDate.value;
			var eventLocation = [Geolocation.latLng().lng, Geolocation.latLng().lat];
			var eventHost = Meteor.userId();
			var attending = [];
			attending.push(eventHost);
			checkEvents.insert({
				name: eventName,
				date: eventDate,
				location: eventLocation,
				host: currentUserId,
				attending: attending
			});


	}});

	Template.checkIn.helpers({
		'checkEvent': function(){
			return checkEvents.find().fetch(); 
		},
		'nearbyEvents' : function(){
			var locations = checkEvents.find().fetch(); 
			var nearbyLocations = []
			var delta_x = 0;
			var delta_y = 0;
			for (var i = 0; i < locations.length; i++ ){
				console.log(Geolocation.latLng().lat)
				console.log(locations[i].location[0])
				delta_x = Geolocation.latLng().lng - locations[i].location[0]
				delta_y = Geolocation.latLng().lat - locations[i].location[1]

				if ((delta_x*delta_x + delta_y*delta_y) < 10*10 ){
					nearbyLocations.push(locations[i]);
					console.log('yes');
					console.log(nearbyLocations[0])
				}
			}

			return nearbyLocations

		}

	});




////////////////END////////////////////////

	Template.testingZone.helpers({
		'user': function(){

			return Meteor.users.find().fetch()
		}
	})

	Template.createEvent.helpers({
		'checkEvent': function(){
			return checkEvents.find().fetch()
		}
	})


	Template.createEvent.helpers({
		'myevents': function(){
			var currentUserId = Meteor.userId();
			return checkEvents.find({createdby: Meteor.userId()});
		}
	});

		//Map
	Template.checkIn.helpers({
		loc: function () {
			// return 0, 0 if the location isn't ready
			return Geolocation.latLng() || { lat: 0, lng: 0 };
		},
		error: Geolocation.error
	});



	Template.testingZone.rendered = function () {
		var mapOptions = {
			center: { lat: -34.397, lng: 150.644},
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.HYBRID
		};

		var map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
	}
		// checkEvents.insert({ name: "Bob", date: 03/04/15, time: 22:00})

	// Meteor.user().services.facebook.name
	// Geolocation.currentLocation().coords.latitude

}
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


// if (Meteor.isServer) {
//   Meteor.publish("userData", function () {
// 	return Meteor.users.find();
//   });
// }
// if (Meteor.isServer) {
//     Meteor.users().allow({
//     'insert': function (userId,doc) {
//        user and doc checks ,
//       return true to allow insert 
//       return true; 
//     }
//   });
// }

//------------------------------------------------------------//

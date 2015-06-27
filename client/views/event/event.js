Template.event.onRendered(function(){
	var result = checkEvents.findOne({_id: Session.get("currentEvent")})
	var map;
	if(result){
	    var geoLocation = result.geoLocation;
	}
	else{
		var geoLocation = { lat: 40.7, lng: -74 }
	}
	 Session.set('eventLocation', geoLocation);
    var mapCanvas = document.getElementById('map-canvas');
   
    var mapOptions = {
      center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    map = new google.maps.Map(mapCanvas, mapOptions)
	var marker = new google.maps.Marker({
	  position: geoLocation,
	  map: map,
	  title: result.name
	});
});


Template.event.helpers({
	checkedIn : function(){
		var eventId = Session.get("currentEvent");
		Meteor.call('eventHost', eventId, function(error, result){
			Session.set('currentEventHost', result);
		});
		
		var thisEvent = checkEvents.findOne(eventId);
		var myGeolocation = Geolocation.latLng() || Meteor.user().profile.geoLocation;
		var locGeolocation = thisEvent.geoLocation
		if(thisEvent.attending.indexOf(Meteor.userId()) > -1){ //in array
			return true
		}
		else{
			return false
		}
	},
	nearby : function(){
		if(distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat) > .01){
			return true
		}
		else{
			return false
		}
	},
	eventHost : function(){
		return Session.get('currentEventHost')
	},
	isHost : function(){
		if(Session.get('currentEventHost')){
			if (Meteor.userId() == Session.get('currentEventHost')._id){
				return true
			}
		}
		else{
			return false
		}
	},
	currentEvent : function(){
		var id = Session.get("currentEvent")

		var result = checkEvents.findOne({_id: Session.get("currentEvent")})
		document.title = result.name;
		result['dateParsed'] = parseDate(result['eventTimes'][0][0],result['eventTimes'][0][1])
		return result		
	},
	address : function(){
		if(Session.get('eventLocation')){
			var lat = Session.get('eventLocation').lat
			var lng = Session.get('eventLocation').lng
			var js;
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyA3IaCGmNfltsyk5fyATz-icw-D5VFhSYw';
			var cityName0;
			var cityName;
			$.ajaxSetup({
			   async: false
			});
			$.getJSON(url, function(data) {
					js = data;
					cityName0 = js.results[0].address_components[0].long_name;
					cityName01 = js.results[0].address_components[1].long_name;
					cityName = js.results[0].address_components[2].long_name;
					cityName1 = js.results[0].address_components[3].long_name;

			});
			var result = cityName0 + ' '+cityName01+', '+cityName + ', ' + cityName1;
			return result
		}
		else{
			return ""
		}
	},
	editDescription :function(){
		return Session.get('editDescription')
	},
	eventDescription:function(){
		var id = Session.get("currentEvent")
		var result = checkEvents.findOne({_id: Session.get("currentEvent")})
		var description = result['description']
		return description
	}
});


Template.event.events({
	'click .check-btn':function(){
		var eventId = Session.get("currentEvent")
		var thisEvent = checkEvents.findOne(eventId);
		if(thisEvent.attending.indexOf(Meteor.userId()) > -1){ //in array
			console.log('already in')
		}
		else{
			checkEvents.update({_id: eventId}, {$push: {attending: Meteor.userId()}});
		}
	},
	'click .remove-button':function(){
		checkEvents.remove(Session.get("currentEvent"));
		Router.go('/')
	},
	'click .learn-more' : function(){
		if(Meteor.userId() == Session.get('currentEventHost')){
			console.log('edit description')
		}

	},
	'click #back':function(){
		Router.go('/events')
	},
	'click .morefacts-btn':function(){
		Router.go('attendeeList')
	},
	'click .edit-description':function(){
		console.log('edit');
		Session.set('editDescription', !Session.get('editDescription'));
	},
	'submit .event-description':function(event){
		event.preventDefault()
		checkEvents.update({_id:Session.get('currentEvent')}, { $set: {"description": event.target.eventDescription.value} });
		Session.set('editDescription', !Session.get('editDescription'));
	}
})

Template.event.onRendered(function(){
	Session.set('editDescription', false);
})






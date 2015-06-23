
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
	checkedin : function(){
		var eventId = Session.get("currentEvent");
		var thisEvent = checkEvents.findOne(eventId);
		console.log(thisEvent)
		if(thisEvent.attending.indexOf(Meteor.userId()) > -1){ //in array
			return true
		}
		else{
			return false
		}
		
	},
	currentEvent : function(){
		var id = Session.get("currentEvent")

		var result = checkEvents.findOne({_id: Session.get("currentEvent")})
		document.title = result.name;
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
	}
});


Template.event.events({
	'click .check-btn':function(){
		var eventId = Session.get("currentEvent")
		var thisEvent = checkEvents.findOne(eventId);
		console.log( Meteor.userId())
		console.log(thisEvent.attending)
		// arrValues.indexOf('Sam') > -1
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

	},
	'click #back':function(){
		Router.go('/events')
	},
	'click .morefacts-btn':function(){
		Router.go('attendeeList')
	}
})



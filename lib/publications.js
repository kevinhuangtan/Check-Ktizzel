if (Meteor.isClient) {
	Meteor.subscribe("events");
}

checkEvents = new Mongo.Collection('events');



if (Meteor.isServer) {

	radius = 10

	Meteor.publish("allUserData", function () {
        return Meteor.users.find({}, {fields: {"emails.address": 1}});
	});
	Meteor.publish("events", function(){
		var user = Meteor.users.findOne(this.userId);
		userLocation = user.profile.geoLocation
		return checkEvents.find({
	    $or: [
	      { host: this.userId },
	      { geoLocation: {
            $geoWithin: {$centerSphere : [[userLocation.lng, userLocation.lat], radius]}
    	    }
    	  }
    	]
	  });
	})

	// Meteor.publish("tasks", function () {
	//   return Tasks.find({
	//     $or: [
	//       { name: "intro" },
	//       { owner: this.userId }
	//     ]
	//   });
	// });

	Meteor.methods({
	  setChecked: function () {
	    // Tasks.update(taskId, { $set: { checked: setChecked} });
	    return "server"
	  },
	  hostEvents1: function (hostEvents) {
	   	var locations = []
		for(var i = 0; i < hostEvents.length; i++){
			locations.push(checkEvents.findOne({_id: hostEvents[i]}))
		}

	    return locations
	  },
	  findLocationEvents:function(geoLocation){

	  },
	  findHostEvents:function(){

	  },
	  findPastEvents:function(){

	  }

	});




}

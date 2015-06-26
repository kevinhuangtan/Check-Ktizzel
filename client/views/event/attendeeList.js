// Template.attendeeList.onRendered(function(){
// 	Meteor.call('attendeeList', Session.get("currentEvent"), function(error, result){
// 	    Session.set('attendees', result);
// 	});
// })


Template.attendeeList.helpers({
	attendees : function(){
		var event_id = Session.get("currentEvent");
		Meteor.call('attendeeList', event_id, function(error, result){
	    	Session.set('attendees', result);
		});
		attendeeList = Session.get('attendees')
		return attendeeList
	}
})

Template.attendeeList.events({
	'click #back': function(){
		Router.go('/')
	},
	'click .panel-user': function(){
		Session.set("attendeeEmail", this.email);
		Router.go('attendee');
	}
})


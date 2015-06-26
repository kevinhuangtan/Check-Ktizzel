

Template.attendee.helpers({

	attendee: function(){
		var email = Session.get("attendeeEmail")
		Meteor.call('attendee', email, function(error, result){
	    	Session.set('attendee', result);
		});
		attendee = Session.get('attendee')
		return attendee
	},
})

Template.attendee.events({
	'click #back': function(){
		Router.go('/attendeeList')
	}
})

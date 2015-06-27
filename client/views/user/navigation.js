
Template.checkNavigation.helpers({
	createEvent : function(){
		return (Session.get('currentPage')=='createEvent')
	},
	profile: function(){
		return (Session.get('currentPage')=='profile')
	},
	nearby: function(){
		return (Session.get('currentPage')=='nearby')
	},
	events:function(){
		return (Session.get('currentPage')=='events')
	},
	checkIn:function(){
		return (Session.get('currentPage')=='checkIn')
	},
	more:function(){
		return Session.get('more')
	}


})
Template.checkNavigation.onRendered(function(){
	Session.set('more', false)
})

Template.checkNavigation.events({
	'click .signout': function(event){
		// event.preventDefault();
		Meteor.logout(function(error){
			if(error){
				console.log(error)
				Session.set('error', err.reason)
			} else{
				// Session.set('error', "")
			}
			
		});
	},
	'click .userMode': function(event){
		if(Session.get('userMode')=='attendee') {
			Session.set('userMode', 'host')
			Router.go('host')
		}
		else {
			Session.set('userMode', 'attendee')
			Router.go('/')
		}
	},
	'click .more-btn' : function(event){

		Session.set('more', !Session.get('more'));
	}
})
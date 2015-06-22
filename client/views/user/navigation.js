
Template.checkNavigation.helpers({
	createEvent : function(){
		return (Session.get('currentPage')=='createEvent')
	},
	splash : function(){
		return (Session.get('currentPage')=='splash')
	},
	profile: function(){
		return (Session.get('currentPage')=='profile')
	},
	attendee: function(){
		// console.log(Session.get('userMode'))
		if(!Session.get('userMode')){
			Session.set('userMode', 'attendee')
		}
		return (Session.get('userMode')=='attendee')
	}

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
			Router.go('splash')
		}
	}
})
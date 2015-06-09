
Template.checkNavigation.helpers({
	createEvent : function(){
		console.log(Session.get('currentPage'))
		return (Session.get('currentPage')=='createEvent')
	},
	splash : function(){
		return (Session.get('currentPage')=='splash')
	},
	profile: function(){
		return (Session.get('currentPage')=='profile')
	}

})

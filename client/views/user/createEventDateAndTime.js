Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
/////
function createEventTimes(dateArray, times){
	time_example = {'day': day, 'startHour': startHour,'startMinute': startMinute, 'endHour':endHour,'endMinute':endMinute}
	daysOfWeek= []
	eventTimes = []
	for (var i = 0; i < times.length; i++){
		daysOfWeek.push(times[i].getDay())
	}
	for(var i = 0; i < dateArray.length; i++){
		var day_index = daysOfWeek.indexOf(dateArray[i].getDay())
		if(day_index > -1){
			var year = dateArray[i].getYear() + 1900
			var month = dateArray[i].getMonth()
			var date = dateArray[i].getDate()
			var day = dateArray[i].getDay()
			var startDate = new Date(year, month, date, times[day_index]['startHour'], times[day_index]['startMinute'])
			var endDate = new Date(year, month, date, times[day_index]['endHour'], times[day_index]['endMinute'])
			eventTimes.push([startDate, endDate])
		}
	}
	return eventTimes

}

Template.eventDateAndTime.onRendered(function(){
	Session.set('selectedYear', new Date().getYear())
	Session.set('selectedMonth', new Date().getMonth())
})

Template.eventDateAndTime.helpers({
	myLocation: function () {
		// return 0, 0 if the location isn't ready
		if(Geolocation.latLng()){
			geoLocation = Geolocation.latLng()
			Session.set('geoLocation', geoLocation);
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
		}
		// console.log(Geolocation.latLng())
		return Geolocation.latLng() || { lat: 0, lng: 0 };
	},
	dayOption : function(){

		var selectedYear = Session.get('selectedYear')
		var selectedMonth = Session.get('selectedMonth')
		var days = []

		if ((selectedMonth==new Date().getMonth()) && (selectedYear==new Date().getYear())) {			
			var thisDay = new Date()
			var numDaysInMonth = new Date(thisDay.getYear(), thisDay.getMonth()+1, 0).getDate();
 			for (var i = 1; i <= numDaysInMonth; i++){
				var day = {'index': i}
				if(i == thisDay.getDate()){
					day['selected'] = true
				}
				days.push(day)
			}
		} else {
			var numDaysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
 			for (var i = 1; i <= numDaysInMonth; i++){
				var day = {'index': i}
				days.push(day)
			}
		}
		return days
	},
	monthOption : function(){
		var months = []
		var thisMonth = new Date().getMonth() + 1
		for (var i = 1; i <= 12; i++){
			var month = {'index': i}
			if(i == thisMonth){
				month['selected'] = true
			}
			months.push(month)
		} 
		return months		
	},
	hourOption : function(){
		var hours = []
		var thisHour = new Date().getHours()%12
		for (var i = 1; i <= 12; i++){
			var hour = {'index': i}
			if(i == thisHour){
				hour['selected'] = true
			}
			hours.push(hour)
		} 
		return hours		
	},
	endHourOption : function(){
		var hours = []
		var thisHour = new Date().getHours()%12
		thisHour+=1
		for (var i = 1; i <= 12; i++){
			var hour = {'index': i}
			if(i == thisHour){
				hour['selected'] = true
			}
			hours.push(hour)
		} 
		return hours		
	},
	amOption : function(){
		var AMPM = [{'value':'AM'},{'value':'PM'}]
		var thisHour = new Date().getHours()
		var ampm = Math.floor(thisHour/12)
		if(ampm==0){ //AM
			AMPM[0]['selected'] = true
		}
		else{ //PM
			AMPM[1]['selected'] = true
		}
		return AMPM		
	},
	minuteOption : function(){
		var minutes = []
		var thisMinute = new Date().getMinute() + 1
		for (var i = 1; i <= 12; i++){
			var minute = {'index': i}
			if(i == thisMinute){
				minute['selected'] = true
			}
			minutes.push(minute)
		} 
		return minutes		
	}
})


Template.eventDateAndTime.events({
	'submit form': function(event){
		var target = event.target
		event.preventDefault()
		var startPM = 0;
		var endPM = 0;
		if (target.startAmpm.value == "PM"){
			startPM = startPM + 12
		}
		if (target.endAmpm.value == "PM"){
			endPM = endPM + 12
		}

		
		var month = Number(target.month.value) - 1
		var date = Number(target.date.value)
		var startDate = new Date(target.year.value, month, date, Number(target.startHour.value) + startPM, target.startMinute.value);
		var endDate = new Date(target.year.value, month, date, Number(target.endHour.value) + endPM, target.endMinute.value);
		var eventSession = Session.get('eventSession');

		///parsing
		var weekday = startDate.getDay()
		var options = {hour:'2-digit', minute:'2-digit' };
		var startTime = startDate.toLocaleTimeString('en-US',options).toString();
		var endTime = endDate.toLocaleTimeString('en-US',options).toString();
		

		var startDateParse = startDate.toLocaleDateString();
		var endDateParse = endDate.toLocaleDateString();
		if(startDateParse = endDateParse){
			eventSession['dateParsed'] = WEEKDAY[weekday] + ', ' + MONTH[month] + ' '+ date + ', ' + startTime + ' - ' + endTime
		}
		else{
			var endDay = weekday[eventSession.endDate.getDay()]
			eventSession['dateParsed'] = WEEKDAY[weekday] + ', ' + MONTH[month] + ' '+ date + ', ' + startTime + ' - ' + endDay + ' ' + endTime
		}


		eventSession['startDate'] = startDate;
		eventSession['endDate'] = endDate;
		Session.set('eventSession', eventSession)
		Router.go('eventLocation');
	},
	'change #month': function(event){
		var month = Number(event.target.value) - 1
		Session.set('selectedMonth', month)
	},
	'change #year': function(event){
		var year = Number(event.target.value)
		Session.set('selectedYear', year)
	},
	'click #back':function(){
		Router.go('eventTitle')
	},
	'click #next':function(){
		Router.go('eventLocation')
	}
});

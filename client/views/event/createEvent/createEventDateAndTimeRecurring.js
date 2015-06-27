var WEEKDAY = new Array(7);
WEEKDAY[0]=  "SUN";
WEEKDAY[1] = "MON";
WEEKDAY[2] = "TUE";
WEEKDAY[3] = "WED";
WEEKDAY[4] = "THU";
WEEKDAY[5] = "FRI";
WEEKDAY[6] = "SAT";
WEEKDAY_DICT = {"SUN":0, "MON": 1, "TUE": 2,"WED": 3, "THU": 4, "FRI": 5, "SAT" :6}

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

function createEventTimes(dateArray, times){
	daysOfWeek= []
	eventTimes = []
	for (var i = 0; i < times.length; i++){
		daysOfWeek.push(WEEKDAY_DICT[times[i]['day']])
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
			var  newTime = [startDate, endDate]
			eventTimes.push(newTime)
		}
	}
	return eventTimes

}
Template.eventDateAndTimeRecurring.onRendered(function(){
		var startHour = $('#startHour').val()
		var startMinute = $('#startMinute').val()
		var endHour = $('#endHour').val()
		var endMinute = $('#endMinute').val()
		var dayOfWeek = $('#dayOfWeek').val()
		var startAmpm = $('#startAmpm').val()
		var endAmpm = $('#endAmpm').val()
		var timeSlot = {'dayOfWeek': dayOfWeek, 'startHour': startHour, 'startMinute': startMinute,'startAmpm': startAmpm, 'endHour':endHour, 'endMinute':endMinute, 'endAmpm': endAmpm}
		Session.set('timeSlot', timeSlot)
		var currentDate = new Date()
		Session.set('selectedStartYear', currentDate.getYear())
		Session.set('selectedStartMonth', currentDate.getMonth())
		Session.set('selectedStartDate', currentDate.getDate())
		Session.set('selectedEndYear', currentDate.getYear())
		Session.set('selectedEndMonth', currentDate.getMonth())
		Session.set('selectedEndDate', currentDate.getDate())		
})

Template.eventDateAndTimeRecurring.events({
	'submit form': function(event){
		event.preventDefault()
		var timeSlot = Session.get('timeSlot')
		var startPM = 0;
		var endPM = 0;
		if (timeSlot['startAmpm'] == "PM"){
			startPM = startPM + 12
		}
		if (timeSlot['endAmpm'] == "PM"){
			endPM = endPM + 12
		}
		var startDate = new Date(event.target.startYear.value,event.target.startMonth.value,event.target.startDate.value)
		var endDate = new Date(event.target.endYear.value,event.target.endMonth.value,event.target.endDate.value)
		var dateArray = getDates(startDate, endDate)
		var time1 = {'day': event.target.day.value, 'startHour': Number(event.target.startHour.value) + startPM,'startMinute': event.target.startMinute.value, 'endHour': Number(event.target.endHour.value) + endPM,'endMinute':event.target.endMinute.value}
		console.log(time1)
		var times = [time1]
		var eventTimes = createEventTimes(dateArray, times)
		for(var i = 0; i < eventTimes.length; i++){
			console.log(eventTimes[i])
		}
		var eventSession = Session.get('eventSession');
		eventSession['eventTimes'] = eventTimes
		Session.set('eventSession', eventSession)
		Router.go('eventLocation');
	},
	'change .timeslot' : function(){
		console.log('changed')
		var startHour = $('#startHour').val()
		var startMinute = $('#startMinute').val()
		var endHour = $('#endHour').val()
		var endMinute = $('#endMinute').val()
		var dayOfWeek = $('#dayOfWeek').val()
		var startAmpm = $('#startAmpm').val()
		var endAmpm = $('#endAmpm').val()
		var timeSlot = {'dayOfWeek': dayOfWeek, 'startHour': startHour, 'startMinute': startMinute,'startAmpm': startAmpm, 'endHour':endHour, 'endMinute':endMinute, 'endAmpm': endAmpm}
		Session.set('timeSlot', timeSlot)

	},
	'change #startMonth' : function(event){
		var month = Number(event.target.value) - 1
		Session.set('selectedStartMonth', month)
	},
	'change #endMonth' : function(event){
		var month = Number(event.target.value) - 1
		Session.set('selectedEndMonth', month)
	},
	'change #startYear': function(event){
		var year = Number(event.target.value)
		Session.set('selectedStartYear', year)
	},
	'change #endYear': function(event){
		var year = Number(event.target.value)
		Session.set('selectedEndYear', year)
	},
	'change #startDate': function(event){
		var date = Number(event.target.value)
		Session.set('selectedStartDate', date)
	},
	'change #endDate': function(event){
		var date = Number(event.target.value)
		Session.set('selectedEndDate', date)
	},
});
Template.eventDateAndTimeRecurring.helpers({
	myLocation: function () {
		// return 0, 0 if the location isn't ready
		if(Geolocation.latLng()){
			geoLocation = Geolocation.latLng()
			Session.set('geoLocation', geoLocation);
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
		}
		return Geolocation.latLng() || { lat: 0, lng: 0 };
	},
	startDayOption : function(){
		var selectedYear = Session.get('selectedStartYear')
		var selectedMonth = Session.get('selectedStartMonth')
		var selectedDate = Session.get('selectedStartDate')
		var days = []
		var numDaysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
		console.log(numDaysInMonth)
		for (var i = 1; i <= numDaysInMonth; i++){
			var day = {'index': i}
			if(i == selectedDate){
				day['selected'] = true
			}
			days.push(day)
		}

		return days
	},
	endDayOption : function(){
		var selectedYear = Session.get('selectedEndYear')
		var selectedMonth = Session.get('selectedEndMonth')
		var selectedDate = Session.get('selectedEndDate')
		var days = []
		var numDaysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
		console.log(numDaysInMonth)
		for (var i = 1; i <= numDaysInMonth; i++){
			var day = {'index': i}
			if(i == selectedDate){
				day['selected'] = true
			}
			days.push(day)
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
	},
	timeParsed : function(){
		var times = []
		var timeSlot = Session.get('timeSlot')
		if(timeSlot){
			times.push(timeSlot)
			var timesParsed = []
			for (var i = 0; i < times.length; i++){
				var startPM = 0;
				var endPM = 0;
				if (times[i]['startAmpm'] == "PM"){
					startPM = startPM + 12
				}
				if (times[i]['endAmpm'] == "PM"){
					endPM = endPM + 12
				}
				var startDate = new Date(0, 0, 0, Number(times[i]['startHour']) + startPM, Number(times[i]['startMinute']));
				var endDate = new Date(0, 0, 0, Number(times[i]['endHour']) + endPM, Number(times[i]['endMinute']));

				var weekday = times[i]['dayOfWeek']
				var options = {hour:'2-digit', minute:'2-digit'};
				var startTime = startDate.toLocaleTimeString('en-US',options).toString();
				var endTime = endDate.toLocaleTimeString('en-US',options).toString();
			
				timesParsed.push(weekday + ', ' + startTime + ' - ' + endTime)
			}
		}
		else{
			timesParsed = ""
		}

		return timesParsed
	}
})





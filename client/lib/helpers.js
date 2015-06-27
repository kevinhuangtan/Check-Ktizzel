distance = function(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  // var d  = 5
  return d.toFixed(1);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

nextStartEndDates = function(eventTimes)

  var numTimes = eventTimes.length
  var nextStartDate = eventTimes[numTimes - 1][0]
  var nextEndDate = eventTimes[numTimes - 1][1]
  var dates = []

  for (var j = 0; j < numTimes; j++) {
    if(j > 0) {
      if((eventTimes[j][0] > currentDate) && (eventTimes[j-1][1] < currentDate)) {
        nextStartDate = eventTimes[j][0];
        nextEndDate = eventTimes[j][1];
      } else if((eventTimes[j][0] < currentDate) && (eventTimes[j][1] > currentDate)) {
        nextStartDate = eventTimes[j][0];
        nextEndDate = eventTimes[j][1];
      }
    } else if(eventTimes[0][1] > currentDate) {
      nextStartDate = eventTimes[0][0];
      nextEndDate = eventTimes[0][1];
    }
  }
  dates.push(nextStartDate)
  dates.push(nextEndDate)

  return dates
}


parseDate = function (startDate,endDate){
    var WEEKDAY = new Array(7);
    WEEKDAY[0]=  "SUN";
    WEEKDAY[1] = "MON";
    WEEKDAY[2] = "TUE";
    WEEKDAY[3] = "WED";
    WEEKDAY[4] = "THU";
    WEEKDAY[5] = "FRI";
    WEEKDAY[6] = "SAT";

    var MONTH = new Array(12);
    MONTH[0] = "JAN"
    MONTH[1] = "FEB"
    MONTH[2] = "MAR"
    MONTH[3] = "APR"
    MONTH[4] = "MAY"
    MONTH[5] = "JUN"
    MONTH[6] = "JUL"
    MONTH[7] = "AUG"
    MONTH[8] = "SEP"
    MONTH[9] = "OCT"
    MONTH[10] = "NOV"
    MONTH[11] = "DEC"
    
    var month = startDate.getMonth() - 1
    var date = startDate.getDate()
    var date2 = endDate.getDate()
    ///parsing
    var weekday =  startDate.getDay()
    var options = {hour:'2-digit', minute:'2-digit' };
    var startTime = startDate.toLocaleTimeString('en-US',options).toString();
    var endTime = endDate.toLocaleTimeString('en-US',options).toString();
    
    if(date == date2){ //same day
      var dateParsed = WEEKDAY[weekday] + ', ' + MONTH[month] + ' '+ date + ', ' + startTime + ' - ' + endTime
    }
    else{
      var endDay = weekday[endDate.getDay()]
      var dateParsed = WEEKDAY[weekday] + ', ' + MONTH[month] + ' '+ date + ', ' + startTime + ' - ' + endDay + ' ' + endTime
    }

    return dateParsed
}
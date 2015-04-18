
Router.map(function() {
	this.route("home", {path: '/'});
    this.route("viewEvent", {path: '/viewEvent'});
    this.route("createEvent", {path: '/createEvent'});
    this.route("checkIn", {path: '/checkIn'});
    this.route("scrollEvents", {path: '/scrollEvents'});
});

// checkEvents.insert({
//     name: "Conference",
//     date: "March 1st 4:00pm",
//     location: "Yale CEID"});

if (Meteor.isClient) {
  // This code only runs on the client
    // Template.scrollEvents.helpers({
    //     tasks: function () {
    //         if (Session.get("hideCompleted")) {
    //         // If hide completed is checked, filter tasks
    //             return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    //         } else {
    //         // Otherwise, return all of the tasks
    //             return Tasks.find({}, {sort: {createdAt: -1}});
    //         }
    //     },
    //     hideCompleted: function () {
    //         return Session.get("hideCompleted");
    //     },
    //     incompleteCount: function () {
    //         return Tasks.find({checked: {$ne: true}}).count();
    //     },
    // });

    // Template.scrollEvents.events({
    //     "submit .new-task": function (event) {
    //       // This function is called when the new task form is submitted

    //       var text = event.target.text.value;

    //       Tasks.insert({
    //         text: text,
    //         createdAt: new Date() // current time
    //       });

    //       // Clear form
    //       event.target.text.value = "";

    //       // Prevent default form submit
    //       return false;
    //     },
    //     "click .toggle-checked": function () {
    //       // Set the checked property to the opposite of its current value
    //       Tasks.update(this._id, {$set: {checked: ! this.checked}});
    //     },
    //     "click .delete": function () {
    //       Tasks.remove(this._id);
    //     },
    //     "change .hide-completed input": function (event) {
    //       Session.set("hideCompleted", event.target.checked);
    //     }
    //   });

    //Map
    Template.checkIn.helpers({
        loc: function () {
            // return 0, 0 if the location isn't ready
            return Geolocation.latLng() || { lat: 0, lng: 0 };
        },
        error: Geolocation.error
    });

    Template.testingZone.helpers({
        'user': function(){
            return Meteor.users.find().fetch()
        }
    })

     Template.createEvent.helpers({
        'checkEvent': function(){
            return checkEvents.find().fetch()
        }
        // 'currentUser': function(){
        //     return Meteor.user();
        // }
    })

    Template.createEvent.events({
        'submit form': function(event){
            event.preventDefault();
            var eventName = event.target.eventName.value;
            var eventDate = event.target.eventDate.value;
            var eventLocation = event.target.eventLocation.value;
            // Testing out Mongo near function
            // var eventLocation = [Geolocation.latLng().lng, Geolocation.latLng().lat];
            checkEvents.insert({
            name: eventName,
            date: eventDate,
            location: eventLocation
            });

            // console.log(Meteor.user.find({ _id: this.userId }, {fields: {testing: 1} } ) );
            Meteor.users.update({_id:Meteor.user()._id}, { $set: {eventDate: 1} });
            // Meteor.user().newField = "Testing";
           

            console.log(checkEvents.find().fetch());
            // below does not work on client side
            // console.log(checkEvents.find({"location": { $geoWithin : { $center : [ [-74, 40.74 ] , 10 ] } } } ));

    // })

    Template.testingZone.rendered = function () {
        var mapOptions = {
            center: { lat: -34.397, lng: 150.644},
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    }
        // checkEvents.insert({ name: "Bob", date: 03/04/15, time: 22:00})

    // Meteor.user().services.facebook.name
    // Geolocation.currentLocation().coords.latitude
}

// if (Meteor.isServer) {
//     Meteor.users().allow({
//     'insert': function (userId,doc) {
//        user and doc checks ,
//       return true to allow insert 
//       return true; 
//     }
//   });
// }

//c3.js charts code
//------------------------------------------------------------//

var donutchart = c3.generate({
            bindto: '#ethnicity_donut_chart',
            size: {
                height: 240,
                width: 480
            },
            data: {
                columns: [
                    ['Loading, please standby...', 30],
                ],
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: "Ethnicity"
            }
        });
        //in final code we can do this without timeout but keeping in case we need to know how
        setTimeout(function () {
            donutchart.load({
                columns: [
                    ["White", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                    ["African-American", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                    ["Hispanic", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                    ["Asian", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                    ["Other", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                ]
            });
        }, 1500);

        setTimeout(function () {
            donutchart.unload({
                ids: 'Loading, please standby...'
            });
        }, 2500);

    var attendencelinechart = c3.generate({
            bindto: '#attendence_rate_line',
            size: {
                height: 240,
                width: 480
            },
            data: {
                x: 'x',
                columns: [
                    ['x','2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04', '2015-01-05', '2015-01-06'],
                    ['Overall attendence', 0.8, 0.9, 0.85, 0.7, 0.65, 0.7],
                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            }
        });
//------------------------------------------------------------//

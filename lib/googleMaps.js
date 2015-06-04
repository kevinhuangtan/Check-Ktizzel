// function initialize() {
//     var mapCanvas = document.getElementById('map-canvas');
//     var mapOptions = {
//       center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
//       zoom: 13,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     }
//     map = new google.maps.Map(mapCanvas, mapOptions)
// 	google.maps.event.addListener(map, "click", function(event)
//     {
//         // place a marker
//         placeMarker(event.latLng);

//         // display the lat/lng in your form's lat/lng fields
//         document.getElementById("latFld").value = event.latLng.lat();
//         document.getElementById("lngFld").value = event.latLng.lng();
//     });

// }
// function placeMarker(location) {
//     // first remove all markers if there are any
//     deleteOverlays();

//     var marker = new google.maps.Marker({
//         position: location, 
//         map: map
//     });

//     // add marker in markers array
//     markersArray.push(marker);

//     //map.setCenter(location);
// }

// // Deletes all markers in the array by removing references to them
// function deleteOverlays() {
//     if (markersArray) {
//         for (i in markersArray) {
//             markersArray[i].setMap(null);
//         }
//     markersArray.length = 0;
//     }
// }
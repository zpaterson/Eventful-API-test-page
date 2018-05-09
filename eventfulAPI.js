const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);

// //sample search, try running it to see it in action
// client.searchEvents({
//   keywords: 'tango',
//   location: 'San Francisco',
//   date: "Next Week"
// }, function(err, data){
//    if(err){
//      return console.error(err);
//    }
//    let resultEvents = data.search.events.event;
//    console.log('Received ' + data.search.total_items + ' events');
//    console.log('Event listings: ');
//    for ( let i =0 ; i < resultEvents.length; i++){
//      console.log("===========================================================")
//      console.log('title: ',resultEvents[i].title);
//      console.log('start_time: ',resultEvents[i].start_time);
//      console.log('venue_name: ',resultEvents[i].venue_name);
//      console.log('venue_address: ',resultEvents[i].venue_address);
//    }
// });

//export a custom function that searches via Eventful API, displays the results AND stores some of the data into MySQL
//created an anonymous object the has a key called getEvent which has a value of an anonymous function
module.exports = {getEvent: (keyword, insertData) => {
  const optionObj = {
    keywords: keyword,
    location: "San Francisco",
    date: "Next Week"
  };

  //let eventList = [];
  let resultEvents;


  client.searchEvents(optionObj, (err, data) => {
    if (err) {
      return console.error(err);
    }
    resultEvents = data.search.events.event;

    //console.log('Received ' + data.search.total_items + ' events');
    console.log('Event listing: ');

    //for ( let i = 0 ; i < resultEvents.length; i++){
      let newTitle = resultEvents[0].title;
      let newTime = resultEvents[0].start_time;
      let newVenue = resultEvents[0].venue_name;
      let newAddress = resultEvents[0].venue_address;

      console.log("===========================================================")
      console.log('title: ', resultEvents[0].title);
      console.log('time: ', resultEvents[0].start_time);
      console.log('venue: ',resultEvents[0].venue_name);
      console.log('address: ', resultEvents[0].venue_address);

      //console.log(eventList);

      let newEvent = {title: newTitle, time: newTime, venue: newVenue, address: newAddress};
      //return eventList;
      // console.log(eventList);
      // console.log(keyword);
    //}
    //the insertData callback function triggers the
    insertData(newEvent);
  });
 }
}

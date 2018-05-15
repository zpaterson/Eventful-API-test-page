const inquirer = require('inquirer');
const connection = require('./connection');
const eventSearch = require('./eventfulAPI');

const getUsersName = () => {
  return inquirer.prompt([{
    type: 'input',
    message: 'What is your name?',
    name: 'name'
  }, {
    type: 'input',
    message: 'What is your email?',
    name: 'email'
  }])
}

const app = {};
app.startQuestion = (closeConnectionCallback) => {
  inquirer.prompt({
    type: 'list',
    message: 'What action would you like to do?',
    choices: [
      'Complete a sentence',
      'Create a new user',
      'Find one event of a particular type in San Francisco next week',
      'Mark an existing user to attend an event in database',
      'See all events that a particular user is going to',
      'See all the users that are going to a particular event',
      'Exit'
    ],
    name:'action',
  }).then((res) => {
    const continueCallback = () => app.startQuestion(closeConnectionCallback);

    if (res.action === 'Complete a sentence') app.completeSentence(continueCallback);
    if (res.action === 'Create a new user') app.createNewUser(continueCallback);
    if (res.action === 'Find one event of a particular type in San Francisco next week') app.searchEventful(continueCallback);
    if (res.action === 'Mark an existing user to attend an event in database') app.matchUserWithEvent(continueCallback);
    if (res.action === 'See all events that a particular user is going to') app.seeEventsOfOneUser(continueCallback);
    if (res.action === 'See all the users that are going to a particular event') app.seeUsersOfOneEvent(continueCallback);
    if (res.action === 'Exit') {
      closeConnectionCallback();
      return;
    }
  })
}

let username;
let useremail;

app.completeSentence = (continueCallback) => {
  getUsersName().then((res) => {
      username = res.name;
      useremail = res.email;
      console.log('Your name is: ' + username + '. Your email is: ' + useremail + '.');
      continueCallback();
    }).catch((err) => {
      console.log(err);
    })
}

app.createNewUser = (continueCallback) => {
  getUsersName().then((res) => {
      username = res.name;
      useremail = res.email;

      console.log('Your name is: ' + username + '. Your email is: ' + useremail + '.');

      const newuser = {name: username, email: useremail};

      connection.query('INSERT INTO users SET ?', newuser, function (err, result, field) {
        if (err) throw err;
        console.log("1 user " + username + " inserted into mySQL database.");
      });
      continueCallback();
    }).catch((err) => {
      console.log(err);
    })
}

app.searchEventful = (continueCallback) => {
  inquirer.prompt({
    type: 'input',
    message: 'What kind of event do you want to search?',
    name: 'keyword'
  }).then((res) => {
    console.log("You are searching for " + res.keyword + ".");

    eventSearch(res.keyword, (newEvent) => {
      inquirer.prompt({
        type: 'confirm',
        message: 'Do you want to save this event? Y/N',
        'default': false,
        name: 'saveToDB'
      }).then((res) => {
          if (res.saveToDB === true) {
            //})
            connection.query('INSERT INTO events SET ?', newEvent, function (err, result, field) {
              if (err) throw err;
            });
            console.log("1 Event inserted into mySQL database.");
            // console.log("result" + result);
            // console.log("field" + field);
            continueCallback();
          }
          else {
            app.searchEventful(continueCallback);
        }
      })
      .catch(err => {
        console.log(err);
      })
    });
  })
  .catch(err => {
    console.log(err);
  })
}

let combine = {};
let userId, eventId;
let usrIdArr = [];
let eventIdArr = [];
app.matchUserWithEvent = (continueCallback) => {
  console.log('=====================================================================================');
  connection.query('SELECT * FROM users', function (err, result, field) {
    if (err) throw err;

    for (var i in result) {
      console.log(' ' + result[i].user_Id + ' | ' + result[i].email);
      usrIdArr.push(result[i].user_Id);
     }
    inquirer.prompt({
      type: 'input',
      message: 'Type in the user_Id number of the user you want',
      name: 'keyword'
    }).then((res) => {
        userId = res.keyword;
        //isValidUserId(userId);
        function isValidUserId(userId) {
          let validUsrId;
          for(var i in usrIdArr) {
            if (parseInt(userId) === usrIdArr[i]) {
               validUsrId = usrIdArr[i];
            }
          }
          if(validUsrId) {
          console.log('=====================================================================================');
            connection.query('SELECT * FROM events', function (err, result, field) {
            if (err) throw err;
            for (var i in result) {
              console.log(result[i].event_Id + ' | ' + result[i].title);
              eventIdArr.push(result[i].event_Id);
             }
             console.log(eventIdArr);
           inquirer.prompt({
             type: 'input',
             message: 'Type in the event_Id number of the event you want',
             name: 'keyword'
            //continueCallback();
          }).then((res) => {
             eventId = res.keyword;

             function isValidId(eventId) {
               let isValid;
               for(var i in eventIdArr) {
                 if (parseInt(eventId) === eventIdArr[i]) {
                    isValid = eventIdArr[i];
                 }
               }
               if(isValid) {
                // console.log(isValid + ' ' + eventId + '\n');
                 combine = {user_Id: userId, event_Id: eventId};
                 console.log('\n' + combine.user_Id + ' ' + combine.event_Id);
                 connection.query('INSERT INTO savedEvents SET ?', combine, function (err, result, field) {
                   if (err) throw err;
                 });
                 continueCallback();
               }
               else {
                 //console.log('Invalid id!')
                 inquirer.prompt({
                   type: 'input',
                   message: 'Please type in a valid event_Id number!',
                   name: 'keyword'
                }).then((res) => {
                   eventId = res.keyword;
                  isValidId(eventId);
                 });
               }
               return isValid;
             }
               isValidId(eventId);
           });
       });
      }
      else {
        inquirer.prompt({
          type: 'input',
          message: 'Please type in a valid user_Id number!',
          name: 'keyword'
       }).then((res) => {
          userId = res.keyword;
         isValidUserId(userId);
        });
      }
      return validUsrId;

      }
      isValidUserId(userId);
    });
  });
 }
 let idArr = [];
app.seeEventsOfOneUser = (continueCallback) => {
  console.log('=====================================================================================');
  connection.query('SELECT * FROM users', function (err, result, field) {
  if (err) throw err;
  for (var i in result) {
    console.log(' ' + result[i].user_Id + ' | ' + result[i].email);
    idArr.push(result[i].user_Id);
   }
  inquirer.prompt({
    type: 'input',
    message: 'Type in the user_Id number of to see all the events this user is attending',
    name: 'keyword'
  }).then((res) => {
      userId = res.keyword;

      function isValidUser(userId) {
        let isValid;
        for(var i in idArr) {
          if (parseInt(userId) === idArr[i]) {
             isValid = idArr[i];
          }
        }
        if(isValid) {
          //console.log('valid id!')
          connection.query('SELECT savedEvents.user_Id, events.event_Id, events.title FROM savedEvents INNER JOIN events ON savedEvents.event_Id = events.event_Id WHERE savedEvents.user_Id = ?', userId , function (err, result, field) {
          if (err) throw err;
          for (var i in result) {
            //console.log(result);
            console.log(' ' + result[i].user_Id + ' | ' + result[i].event_Id + '|' + result[i].title);
           }
           continueCallback();
         });
         //continueCallback();
        }
        else {
          inquirer.prompt({
            type: 'input',
            message: 'Please type in a valid user_Id number!',
            name: 'keyword'
          }).then((res) => {
            userId = res.keyword;
            console.log(idArr[i]);
           isValidUser(userId);
          });
        }
     }
     isValidUser(userId)
    });
  });
}

app.seeUsersOfOneEvent = (continueCallback) => {
  console.log('=====================================================================================');
  connection.query('SELECT * FROM events', function (err, result, field) {
  if (err) throw err;
  for (var i in result) {
    console.log(result[i].event_Id + ' | ' + result[i].title);
    idArr.push(result[i].event_Id);
   }
  inquirer.prompt({
    type: 'input',
    message: 'Type in the event_Id number of to see all the users attending an event',
    name: 'keyword'
  }).then((res) => {
      eventId = res.keyword;

      function isValidEventId(eventId) {
        let isValid;
        for(var i in idArr) {
          if (parseInt(eventId) === idArr[i]) {
             isValid = idArr[i];
          }
        }
        if(isValid) {
          //console.log('valid id!')
          connection.query('SELECT savedEvents.user_Id, events.event_Id, events.title FROM savedEvents INNER JOIN events ON savedEvents.event_Id = events.event_Id WHERE savedEvents.event_Id = ?', eventId, function (err, result, field) {
          if (err) throw err;
          for (var i in result) {
            //console.log(result);
            console.log(' ' + result[i].user_Id + ' | ' + result[i].event_Id + '|' + result[i].title);
           }
            continueCallback();
         });
           //continueCallback();
        }
        else {
          inquirer.prompt({
            type: 'input',
            message: 'Please type in a valid event_Id number!',
            name: 'keyword'
          }).then((res) => {
            eventId = res.keyword;
            console.log(idArr[i]);
           isValidEventId(eventId);
          });
        }
     }
     isValidEventId(eventId)
    });
  });
}

module.exports = app;

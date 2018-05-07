const inquirer = require('inquirer');

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

app.completeSentence = (continueCallback) => {

  function validateName(name){
        return name !== '';
    }

  inquirer.prompt([{
   type: 'input',
   message: 'What is your name?',
   name: 'name',
   //validate: validateName
 }, {
   type: 'input',
   message: 'What is your age?',
   name: 'age',
   //validate: validateName

 }]).then((res) => {
    console.log('Your name is: ' + res.name + ' and your age is: ' + res.age);
    continueCallback();
  })


}

app.createNewUser = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();

}

app.searchEventful = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.matchUserWithEvent = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.seeEventsOfOneUser = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.seeUsersOfOneEvent = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

module.exports = app;

var http = require('http');
var mongoose = require("mongoose");

var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost';

var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// mnessage schema
var messageSchema = new mongoose.Schema({
  name: {
    username: String,
    message: { type: String, trim: true }
  }
});

var Message = mongoose.model('Messages', messageSchema);

/*
// Clear out old data
PUser.remove({}, function(err) {
  if (err) {
    console.log ('error deleting old data.');
  }
});
*/

// create one message
var newMessage = new Message({
  username: 'John Doe',
  message: 'Ciao come va? !"£$%&/()=?è*ç°§.-'
});

// Saving it to the database.
newMessage.save(function (err) {if (err) console.log ('Error on save!')});

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];

// Create a rudimentary http server.  (Note, a real web application
// would use a complete web framework and router like express.js). 
// This is effectively the main interaction loop for the application. 
// As new http requests arrive, the callback function gets invoked.
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  createWebpage(req, res);
}).listen(theport);

function createWebpage (req, res) {
  // Let's find all the documents
  Message.find({}).exec(function(err, result) { 
    if (!err) { 
      res.write(html1 + JSON.stringify(result, undefined, 2) +  html2 + result.length + html3);
      // Let's see if there are any senior citizens (older than 64) with the last name Doe using the query constructor
      var query = Message.find( { username: /doe/i } ); // (ok in this example, it's all entries)
      query.exec(function(err, result) {
      	if (!err) {
      	  res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
      	} else {
      	  res.end('Error in second query. ' + err)
      	}
      });
    } else {
      res.end('Error in first query. ' + err)
    };
  });
}

// Tell the console we're getting ready.
// The listener in http.createServer should still be active after these messages are emitted.
console.log('http server will be listening on port %d', theport);
console.log('CTRL+C to exit');

//
// House keeping.

//
// The rudimentary HTML content in three pieces.
var html1 = '<title> hello-mongoose: MongoLab MongoDB Mongoose Node.js Demo on Heroku </title> \
<head> \
<style> body {color: #394a5f; font-family: sans-serif} </style> \
</head> \
<body> \
<h1> hello-mongoose: MongoLab MongoDB Mongoose Node.js Demo on Heroku </h1> \
See the <a href="https://devcenter.heroku.com/articles/nodejs-mongoose">supporting article on the Dev Center</a> to learn more about data modeling with Mongoose. \
<br\> \
<br\> \
<br\> <h2> All Documents in MonogoDB database </h2> <pre><code> ';
var html2 = '</code></pre> <br\> <i>';
var html3 = ' documents. </i> <br\> <br\>';
var html4 = '<h2> Queried (name.last = "Doe", age >64) Documents in MonogoDB database </h2> <pre><code> ';
var html5 = '</code></pre> <br\> <i>';
var html6 = ' documents. </i> <br\> <br\> \
<br\> <br\> <center><i> Demo code available at <a href="http://github.com/mongolab/hello-mongoose">github.com</a> </i></center>';



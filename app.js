var
  express = require('express')
  app = express( )
, server = require('http').Server(app)
, io = require('socket.io')(server)
, mongoose = require("mongoose")
, uristring = 
              process.env.MONGOLAB_URI || 
              process.env.MONGOHQ_URL || 
               'mongodb://localhost'
, port = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// use static middleware
app.use( express.static( 'client' ) );


// prepare MessagesStore object
var MessagesStore = new (require('./server/stores/MessagesStore'))( mongoose );


// setup connection
io.on('connection', function (socket) {
  // socket.emit('messages', );

  socket.on('postMessage', function (data) {
    socket.broadcast.emit('newMessageSent', data);
  });

});


server.listen(port);

/*
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
}*/
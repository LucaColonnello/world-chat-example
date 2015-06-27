var
  assert = require('assert')
  , mongoose = require("mongoose")
  , uristring = 
                process.env.MONGOLAB_URI || 
                process.env.MONGOHQ_URL || 
                'mongodb://localhost';

mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  }
});


describe('MessagesStore', function( ) {
  var MessagesStore = new (require('../stores/MessagesStore'))( mongoose );

  describe('add', function(){
    it('should add a new Message into the store', function(done){
      MessagesStore.add( {
        username: "Luca Colonnello",
        message: "Hi, how are you? Hoping you are fine!"
      }, function( data ) {
        if( data ) {
          done( );
        }
      } );
    });
  });

  describe('get', function(){
    it('should get the new Message from the store', function( done ){
      MessagesStore.get( {
        username: "Luca Colonnello"
      }, function( r ) {
          assert.equal( r[0].username, "Luca Colonnello" );
          assert.equal( r[0].message, "Hi, how are you? Hoping you are fine!" );
          done( );
      } );
    });
  });

  describe('remove', function(){
    it('should remove the new Message from the store', function( done ){
      MessagesStore.remove( {
        username: "Luca Colonnello"
      }, function( r ) {
        assert.equal( r, 1 );
        done( );
      } );
    });
  });

});
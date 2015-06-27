function MessagesStore( mongoose ) {
	// save mongoose obj
	this.mongoose = mongoose;

	// message schema
	this.messageSchema = new this.mongoose.Schema({
	  username: String,
	  message: { type: String, trim: true }
	});

	this.messageModel = this.mongoose.model('Messages', this.messageSchema);
};


MessagesStore.prototype.add = function( data, successCallback, errCallback ){
	// create one message
	var newMessage = new this.messageModel( data );

	// Saving it to the database.
	newMessage.save(function ( err, message ) {
		if (err) {
			console.log('Error on save!');
			if( typeof errCallback != "undefined" ) {
				errCallback( err );
			}
		} else {
			if( typeof successCallback != "undefined" ) {
				successCallback( message );
			}
		}
	});
};

MessagesStore.prototype.remove = function( filters, successCallback, errCallback ){
	// Clear out old data
	this.messageModel.find( filters || { } ).remove( function( err, removed ) {
		if (err) {
			console.log ('error deleting old data.');
			if( typeof errCallback != "undefined" ) {
				errCallback( err );
			}
		} else {
			if( typeof successCallback != "undefined" ) {
				successCallback( removed );
			}
		}
	});
};

MessagesStore.prototype.get = function( filters, successCallback, errCallback ){
	// Clear out old data
	this.messageModel.find( filters || { } ).exec(function( err, results ) {
		if (err) {
			console.log ('error getting data.');
			if( typeof errCallback != "undefined" ) {
				errCallback( err );
			}
		} else {
			if( typeof successCallback != "undefined" ) {
				successCallback( results );
			}
		}
	});
};

MessagesStore.prototype.getLast = function( filters, successCallback, errCallback ){
	// Clear out old data
	this.messageModel.find( filters || { } ).exec(function( err, results ) {
		if (err) {
			console.log ('error getting data.');
			if( typeof errCallback != "undefined" ) {
				errCallback( err );
			}
		} else {
			if( typeof successCallback != "undefined" ) {
				successCallback( results );
			}
		}
	});
};


module.exports = MessagesStore;
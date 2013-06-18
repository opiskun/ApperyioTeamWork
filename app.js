
/**
 * Module dependencies.
 * For heroku installation read 
 * http://nodetips.com/post/24557680994/deploying-a-node-js-app-to-heroku
 */


var express = require('express')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , url = require('url')
  , fs = require('fs')
  , routes = require('./routes')
  , note = require('./routes/note')
  , git  = require('./routes/git')
  , _ = require('underscore')
  ;


var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// HTTP HTTPS
// read this 
// http://elegantcode.com/2012/01/20/taking-toddler-steps-with-node-js-express-routing/

app.get('/', 	 routes.index);
app.get('/note', note.note);
app.get('/git',  git.git);


var srv = http.createServer(app);
var io = require('socket.io').listen(srv); 
//http://stackoverflow.com/questions/10191048/socket-io-js-not-found/10192084#10192084

srv.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// WebSocket logic  below

//var socket = io.connect("http://localhost", {port: 8080});
// http://www.netmagazine.com/tutorials/angularjs-collaboration-board-socketio

// all notes
var notes = {}; 

function addNote(data){
	notes[data.id] = data;
}

function deleteNote(data){
	delete notes[data.id];
}

function updateNote(data){
    notes[data.id] = data;
}


io.sockets.on('connection', function(socket) {

	socket.on('createNote', function(data) {
	    addNote(data);
		socket.broadcast.emit('onNoteCreated', data);
	});
	socket.on('updateNote', function(data) {
	    updateNote(data);
		socket.broadcast.emit('onNoteUpdated', data);
	});
	socket.on('deleteNote', function(data){
	    deleteNote(data);
		socket.broadcast.emit('onNoteDeleted', data);
	});
	socket.on('moveNote', function(data){
		// add x,y to note model
		socket.broadcast.emit('onNoteMoved', data);
	});
	
	socket.on('readAllNotes', function(data){
	    // push array to client side. 
		socket.emit('onReadAllNotes', notes);
	});

	// git integration
	socket.on('loadAndcommit', function(data){
		console.log(' load and commit ' + JSON.stringify(data));
		downloadProjectBundle(data.bundleid, 
							 function(status) {
									socket.emit("onGitReply", {message:"file loaded."});
							 });
	});
	
	
		
});


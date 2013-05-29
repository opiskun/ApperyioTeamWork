
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

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
app.get('/', routes.index);
//app.get('/users', user.list);

var srv = http.createServer(app);

var io = require('socket.io').listen(srv); 
//http://stackoverflow.com/questions/10191048/socket-io-js-not-found/10192084#10192084

srv.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// WebSocket logic  below

//var socket = io.connect("http://localhost", {port: 8080});
// http://www.netmagazine.com/tutorials/angularjs-collaboration-board-socketio
io.sockets.on('connection', function(socket) {
	socket.on('createNote', function(data) {
		socket.broadcast.emit('onNoteCreated', data);
	});
	socket.on('updateNote', function(data) {
		socket.broadcast.emit('onNoteUpdated', data);
	});
	socket.on('deleteNote', function(data){
		socket.broadcast.emit('onNoteDeleted', data);
	});
	socket.on('moveNote', function(data){
		socket.broadcast.emit('onNoteMoved', data);
	});
});


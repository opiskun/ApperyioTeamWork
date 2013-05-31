
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

	// git integration
	socket.on('loadAndcommit', function(data){
		console.log(' load and commit ' + JSON.stringify(data));
		downloadProjectBundle(data.bundleid, 
							 function(status) {
									socket.emit("onGitReply", {message:"file loaded."});
							 });
	});
});

//http://www.hacksparrow.com/using-node-js-to-download-files.html
var WORKING_DIR = "./working_folder";

function  downloadFile( fromURL, toFile,  callback){
    var file = fs.createWriteStream(toFile);
    	
	https.get(fromURL, function(res) {
			console.log("statusCode: ", res.statusCode);
  			console.log("headers: ", res.headers);
  			var  requestRedirected = false;
  			
  			if ( res.statusCode == 404) {
  				callback(res.statusCode);
  			} else {
	  			if (res.statusCode == 301) {
	  			 requestRedirected = true;
	  			 var  new_url  = "https://appery.io"+res.headers.location;
	  			 var options = {
		    			host: url.parse(new_url).host,
		    			port: 443,
		    			path: url.parse(new_url).pathname,
		    			headers: {
		    				'Host': url.parse(new_url).host, 
		    				'Cookie': res.headers['set-cookie']
		    			}
					};
	  			 	downloadFile(options, toFile,  callback);
	  			}  
  			}
  			
    		res.on('data', function(data) {
            		file.write(data);
        		}).on('error', function(data) {
            		console.log('error in download');
            		console.log(data);
        		}).on('end', function() {
        		    console.log('end request for ' + fromURL);
            		file.end();
            		if (callback != undefined && !requestRedirected ) {
            		        console.log('check download folder');
							callback(res.statusCode);
					 }
        		});
    		});

}

function  downloadProjectBundle(bundleId, done){
	var bundleurl = "https://appery.io/app/project/"+bundleId+"/export/web";
	var tofile = WORKING_DIR + path.sep + bundleId+".zip";
	downloadFile(bundleurl,tofile, done)
}

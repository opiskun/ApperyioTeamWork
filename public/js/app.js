function NotesViewModel(socket){
	var self  = this;
	
	this.notes = ko.observableArray([]); 
	
	socket.on('onNoteCreated', function(data) { 
		self.createNote(data);
	});
	
	socket.on('onNoteDeleted', function(data) { 
		//self.notes.push(data);
		console.log('command  for removing note received');
		console.log(data);
		// find note and remove it
		self.__removeNoteFromList(data);
	});
	
	socket.on('onNoteUpdated', function(data) { 
		console.log('command  for updating note received');
		console.log(data);
		// action find note and update it
		var note = _.findWhere(self.notes(), {id:data.id});
		note.title(data.title);
		note.body(data.body);
		
	});
	
	socket.on('onNoteMoved', function(data) { 
		console.log('command  for moving note received');
		console.log(data);
		// action 
		$("#"+data.id).css('left',data.x).css('top', data.y); 
	});
	
	this.createNewNote = function(){
		self.createNote(undefined);
	}
	
	this.createNote = function(data) { 
		console.log('create note invoked')		
		var note = self.__observedNote(data,  _.debounce( self.updateNote, 1000) );	
		if (data == undefined) {
			socket.emit('createNote', self.__rawNote(note));
		}
		self.notes.push(note);
    };
    
    this.updateNote = function (data){
    	console.log('update note invoked');
    	console.log(data);
    	socket.emit('updateNote', self.__rawNote(data))
    }
    
    this.deleteNote = function(data){
    	console.log("delete note is not implemented");
    	self.__removeNoteFromList(data)
    	socket.emit('deleteNote', data);
    }
    
    this.__removeNoteFromList =  function(data){ 
    	self.notes.remove(function(item){ return item.id == data.id});
    }
    
    
    // model helpers

    this.__rawNote = function(note){
    	return {
    				id: note.id, 
    				title:note.title(), 
    				body:note.body()
    		}
    };

    this.__observedNote = function(future_note, subscriber){
    	var note = future_note || { };
    	var _note = {
    					id: note.id || new Date().getTime(), 
    					title: ko.observable(note['title'] != undefined ? note.title : "New Note"), 
    					body: ko.observable(note['body'] != undefined ? note.body : "Pending")
    				}
    	if(subscriber != undefined) {
    		_note.title.subscribe(function(newvalue){ subscriber(_note) } );
			_note.body.subscribe(function(newvalue){ subscriber(_note) });
    	}
    	return _note;	
    };
    
    
    //view support
    
    this.__afterAdd = function(elements) {
        //console.log(elements);
    	//$(elements).parent().draggable();
    }
    
    this.__afterRender = function(element, note) {
        console.log('-- after render');
        //console.log(arguments);
        var elt = $(element);
        
        $(elt).offset({ top: 50, left: 10 });
       console.log($(elt).attr('style'));
                
        elt.draggable({
                stop: function(event, ui) {
                      socket.emit('moveNote', {
                        id: note.id,
                        x: ui.position.left,
                        y: ui.position.top
                    });
                }
            });  
    } 	
}

function App(){
	this.init = function(){}
	this.run=function(){
		this.socket = io.connect();
		this.notesModel = new NotesViewModel(this.socket);
		ko.applyBindings(this.notesModel);
		console.log('app run');
	}
}


$(document).ready(function(){

var app = new App();
	app.run();
	
})


function App(){
    var self = this;
	this.init = function(){}
	this.run=function(){
		if (location.pathname == '/note'){
	 		this.notes();
		} else
		if (location.pathname == '/git'){
	 		this.git();
		}
		console.log('app run');
	}
	
	this.notes = function(){
		self.socket = io.connect();
		self.notesModel = new NotesViewModel(this.socket);
		ko.applyBindings(this.notesModel);
		self.notesModel.loadAllNotes();
		console.log('notes view model');
	}
	
	this.git = function(){
		self.socket = io.connect();
		self.gitModel = new GitViewModel(this.socket);
		ko.applyBindings(this.gitModel);
		console.log('git view model');
	}
	
	
}


$(document).ready(function(){

var app = new App();
	app.run();
})
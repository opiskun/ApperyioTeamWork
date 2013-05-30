function GitViewModel(socket){
	var self  = this;
	
	this.bundleid = ko.observable('3983f3e1-1aad-4822-a184-d40a9b07486f');
	this.path2remotegit = ko.observable('');
	this.login2remotegit = ko.observable('');
	this.password2remotegit = ko.observable(''); 
	
	this.loadAndCommit = function(){
		
		socket.emit('loadAndcommit',{ 
					bundleid: self.bundleid(),
					path2remotegit: self.path2remotegit(),
					login2remotegit: self.login2remotegit(),
					password2remotegit: self.password2remotegit(),
				} );
	} 	
	
	socket.on('onGitReply',  function(data){
	    $('<p>'+data.message+'</p>').appendTo($('#logview'));
	});
}

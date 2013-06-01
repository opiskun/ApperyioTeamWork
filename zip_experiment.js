
/**
 * Module dependencies.
 * For heroku installation read 
 * http://nodetips.com/post/24557680994/deploying-a-node-js-app-to-heroku
 */

var 
   unzip = require('unzip')
  ,path = require('path')
  ,url = require('url')
  ,fs = require('fs')
  ,exec = require('child_process').exec
  ;
  

var WORKING_DIR = "./working_folder";
var  bundle = '3983f3e1-1aad-4822-a184-d40a9b07486f';
var  remoterep = 'apperyiotestremotedeployment';

unzipCmd(bundle,
          function(){
                console.log('unzipped....');
                
                patchAppForHerokuCmd(bundle,  function(){
	                		console.log('PATHCHED....');
			          		gitInitAddAllCmd(bundle, function(){
			          			console.log('git init add commit....');
			          			gitAddHerokuCmd(bundle,remoterep, function(){
			          				console.log('done. ready for push to  heroku.');
			          				// push code here
			          			} )
			          		})            				
                		}); 
                
          } 
         );



function  unzipCmd(bundleId, next){
		var command = "unzip  -uo " + WORKING_DIR + path.sep + bundleId + ".zip -d "+ WORKING_DIR + path.sep + bundleId;
		execCommand(command, function(){next(bundleId)}); 
}

// <?php include_once("home.html"); ?>  --  as content of index.php

function  patchAppForHerokuCmd(bundleId, next){
        console.log(__dirname);
		var command = "cd "+ WORKING_DIR + path.sep + bundleId +" ; mv index.html start_index.html; echo '<?php include_once(\"start_index.html\" ); ?> ' > index.php;  ";
		execCommand(command, function(){next(bundleId)}); 
}


function  gitInitAddAllCmd(bundleId, next){
		console.log(__dirname);
		var command = "cd "+WORKING_DIR+" ; git init -q  ; git add . ;git commit -am 'commit changes'; cd ..  ";
		execCommand(command, function(){next(bundleId)}); 
}

function  gitAddHerokuCmd(bundleId, applicationName, next){
//git@heroku.com:apperyioteamwork.git
		var command = "cd "+ WORKING_DIR + path.sep + bundleId +";git remote add  heroku  git@heroku.com:"+applicationName+".git";
		execCommand(command, function(){next()}); 
}

function  execCommand(cmd, next){
	var child = exec(cmd, function(err, stdout, stderr) {
					    if (err) throw err;
					    else {
					    	if(next != undefined) next();
					    }
    			});

}


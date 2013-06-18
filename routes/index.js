
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Apperio TeamWork',  brand:"Appery.io Experimental",id: 'home' });
};
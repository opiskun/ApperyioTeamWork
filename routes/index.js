
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express',  brand:"Appery.io",id: 'home' });
};

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Apperio PoC',  brand:"Appery.io",id: 'home' });
};
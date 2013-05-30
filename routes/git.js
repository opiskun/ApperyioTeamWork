
/*
 * GET home page.
 */

exports.git = function(req, res){
  res.render('git', { title: 'Git Demo',  brand:"Appery.io",id: 'git' });
};
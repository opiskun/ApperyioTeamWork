
/*
 * GET home page.
 */

exports.note = function(req, res){
  res.render('note', { title: 'Collaboration Work',  brand:"Appery.io",id: 'note' });
};
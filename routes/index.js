var express = require('express');
var router = express.Router();
var localmw = require('../local/middlewares');


/* GET home page. */
router.get('/', function(req, res) {
 	res.redirect("/html/index.html");    
});

router.post('/processjson', localmw.saveJson, function(req, res) {
  	res.send(200);
});

module.exports = router;

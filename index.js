var express = require('express');
var https = require('https');
var fs = require('fs');
var ejs = require('ejs');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
	res.render('index.ejs');
})

app.use(express.static('public'));

var server = app.listen(app.get('port'), function () {
  var host = server.address().address
  var port = server.address().port
})
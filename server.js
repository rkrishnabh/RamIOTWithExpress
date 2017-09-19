// grab the packages we need
var express = require('express');
var nforce =require('nforce');
var app = express();
var sfuser=process.env.SFUSER;
var sfpass= process.env.SFPASS;

var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//connect to salesforce
var org=nforce.createConnection({
	clientId:process.env.ConsumerKey,
	cllentSecret:process.env.ConsumerSecret,
	redirectUri:'http://localhost:3000/oauth/_callback',
	mode:'single'
	});
	org.authenicate({username:sfuser,password:sfpass},function(err,resp){
	if(!err){
	console.log('connected')
	}else{
	console.log('Error connecting to salesforce' + err.message);
	}
	});

// POST http://localhost:8080/api/users
// parameters sent with 
app.put('/api/users', function(req, res) {
	
	 var tempreading = req.body.tempdata.value;
   console.log('tempreading'+tempreading);

    res.send(tempreading);
});


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
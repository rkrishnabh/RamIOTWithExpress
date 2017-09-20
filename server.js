// grab the packages we need
var express = require('express');
var app = express();
var nforce = require('nforce'),
	tooling = require('nforce-tooling')(nforce);
	var dotenv = require('dotenv');
	dotenv.load();
	var user= 'rama.bhatraju@gmail.com';
	var pass=process.env.PASS;
	var login=process.env.uri;
	console.log('userName'+user);
	console.log('pass'+pass);
	console.log('login'+login);
	console.log('process.env.CLII'+process.env.CLII);
	console.log('process.env.CLIS'+process.env.CLIS);
//var sfuser=process.env.SFUSER;
//var sfpass= pass.env.SFPASS;
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// POST http://localhost:8080/api/users
// parameters sent with 
app.put('/api/users', function(req, res) {
	
	 var tempreading = req.body.tempdata.value;
   console.log('tempreading'+tempreading);

    res.send(tempreading);
	 var org=nforce.createConnection({
	 clientId:process.env.CLII,
	 clientSecret:process.env.CLIS,
	 redirectUri:'https://login.salesforce.com/',
	 apiVersion: 'v40.0',
	 environment: 'production',
	 mode:'multi',
	 plugins:['tooling']
	 });
	 org.authenticate({ username:user,password:pass,loginUri:login},function(err, resp)
	 {if(!err){
		console.log('connected')
		}else{
			console.log('Error connecting to salesforce:::::'+err.message);
		}
	 }
	 );
	
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
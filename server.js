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
//server.listen(port);
var oauth;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//connecting to salesforce
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
		console.log('connected');
		 console.log('Access Token...: ' + resp.access_token);
		 oauth = resp;
		 console.log('oauth ' + oauth);
		 
		}else{
			console.log('Error connecting to salesforce:::::'+err.message);
		}
	 }
	 );


// POST http://localhost:8080/api/users
// parameters sent with 
app.put('/api/users', function(req, res) {
	
	 var tempreading = req.body.tempdata.value;
   console.log('tempreading::::::'+tempreading);
   
   var org=nforce.createConnection({
	 clientId:process.env.CLII,
	 clientSecret:process.env.CLIS,
	 redirectUri:'https://login.salesforce.com/',
	 apiVersion: 'v40.0',
	 environment: 'production',
	 mode:'multi',
	 plugins:['tooling']
	 });
	 //IOT__c creation 
	 function insertLead() {
  console.log('Attempting to insert IOT__c');
  //var voltage='99999999';
  var ld = nforce.createSObject('IOT__c', {
    Voltage__c: tempreading
   
  });
  org.insert({ sobject: ld, oauth: oauth }, function(err, resp) {
    if(err) {
      console.error('--> unable to insert lead');
      console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> IOT__c inserted');
      
    }
  });
}

console.log('Authenticating with Salesforce');

	 // authenticate using username-password oauth flow
	 org.authenticate({ username:user,password:pass,loginUri:login},function(err, resp)
	 {if(!err){
		console.log('connected');
		console.log('Access Token...: ' + resp.access_token);
		 oauth = resp;
		 insertLead();
		}else{
			console.log('Error connecting to salesforce:::::'+err.message);
		}
	 }
	 );
	 
   
   

    res.send();
	
	
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
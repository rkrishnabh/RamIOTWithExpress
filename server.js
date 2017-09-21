// grab the packages we need
var express = require('express');
var app = express();
var nforce = require('nforce'),
	tooling = require('nforce-tooling')(nforce);
var dotenv = require('dotenv');
dotenv.load();
//Variable declaration for sales force connecting
	var user= 'truservdemo@birlasoft.com';
	var pass=process.env.PASS;
	var login=process.env.uri;
//port information for run in locally	
var port = process.env.PORT || 3000;
//for hold the response from sales force 
var oauth;
var voltage;
var org
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// POST http://localhost:8080/sfIOTIntegration


 
app.put('/sfIOTIntegration', function(req, res) {
	voltage = req.body.voltage.value;	 
      console.log('Voltage::::::'+voltage);
      authentication();
      console.log('Authenticating with Salesforce');
      res.send();

});
	//Connecting to salesforce
	function authentication(){
		org=nforce.createConnection({
		 clientId:process.env.CLII,
		 clientSecret:process.env.CLIS,
		 redirectUri:'https://login.salesforce.com/',
		 apiVersion: 'v40.0',
		 environment: 'production',
		 mode:'multi',
		 plugins:['tooling']
		 });
	 // authenticate using username-password oauth flow
		 org.authenticate({ username:user,password:pass,loginUri:login},function(err, resp)
		 {if(!err){
			console.log('connected');
			console.log('Access Token...: ' + resp.access_token);
			 oauth = resp;
			 insertVoltage();
			}else{
				console.log('Error connecting to salesforce:::::'+err.message);
			}
		 }
		 );
	}
        //create record creation in sales force
		function insertVoltage() {
		console.log('Attempting to create record in to salesforce');
		var iot = nforce.createSObject('tsdm__IoT_Light_Sensor__c', {
		tsdm__Voltage__c: voltage
		});
	  org.insert({ sobject: iot, oauth: oauth }, function(err, resp) {
		if(err) {
		  console.error('--> unable to insert iot');
		  console.error('--> ' + JSON.stringify(err));
		} else {
			
		  console.log('--> sensor reading inserted successfully in salesforce');
		  
		}
	  });
	}
app.listen(port);
console.log('Server started! At http://localhost:' + port);

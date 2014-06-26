
/**
 * Module dependencies.
 */
require('express-namespace');
var express = require('express');
var request = require('request');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var url = require('url');

var app = express();

 
//parse.com
var Parse = require('node-parse-api').Parse;
var APP_ID = "NfzjaOxENPzKYkqKogb6gc0yNqQmS7rGqZ3N3rn5"
var MASTER_KEY = "MyDArfuQFQwY78vpLdHvjEhQVgqo4nLwrwSJYuee";
var parse = new Parse(APP_ID, MASTER_KEY);
// the class
var Kaiseki = require('kaiseki');

// instantiate

var REST_API_KEY = 'UgC5AoX8CKHqT1EUnuZab3VNJRbEo2quAiZktXLV';
var kaiseki = new Kaiseki(APP_ID, REST_API_KEY);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

app.get('/', function(req,res){
	//res.render('index',{title:'Home'});
res.render('about_experiment',{
		title:'About Us'
		});
});

app.namespace('/demo',function(){

	app.get('/', function(req,res){
		res.render('index',{title:'Home'});
	});

	app.get('/mobile', function(req,res){
	res.render('mobile_demo',{
		title:'Home'
		});
	});

	app.get('/web', function(req,res){

		res.render('web_demo',{

		});
	});

	app.get('/landing', function(req,res){

		res.render('landing',{

		});
	});


});


app.namespace('/research',function(){

	app.get('/', function(req,res){
		res.render('discover',{
		title:'Discover'
		});

	});

	app.get('/discover', function(req,res){
		res.render('discover',{
		title:'Discover'
		});
	});


});

app.namespace('/movers',function(){

	app.get('/', function(req,res){
		res.render('reward_experiment',{
		title:'Movers'
		});
	});

	app.get('/gifts', function(req,res){
		res.render('reward_experiment',{
		title:'Movers'
		});
	});

	app.get('/about', function(req,res){
		res.render('about_experiment',{
		title:'About Us'
		});
	});

	app.get('/remind', function(req,res){
		res.render('remind_experiment',{
		title:'Remind me'
		});
	});

	app.get('/remind_options', function(req,res){
		res.render('remind_options_experiment',{
		title:'Remind me'
		});
	});

	app.get('/thanks', function(req,res){
		res.render('thanks_experiment',{
		title:'Remind me'
		});
	});
});

app.namespace('/mymovemobile',function(){

	app.get('/landing', function(req,res){
		res.redirect('/mymovemobile/brands');	
	});

	app.get('/brands', function(req,res){

		var params = {
			where:{isPromoting: true},
			order:'-createdAt'
		};

		kaiseki.getObjects('Coupons',params,function(err,response,body,success){
			if(response)
  				console.log('retreive ', body.length + ' coupons');
			
  			res.render('mymovewallet/brands',{
				title:'Movers',
				couponData: body
			});
		});

		
	});

	app.get('/mycoupons', function(req,res){
		var url_parts = url.parse(req.url, true);
		var userObjID = url_parts.query.userObjID;
		console.log(userObjID);
		kaiseki.getUser(userObjID, function(err, response, body, success) {
  			console.log('user info = ', body);
  			res.render('mymovewallet/mycoupons',{
			title:'Movers',
			thisUser:body
			});
		});
		
	});

	app.get('/localdeals', function(req,res){
		var url_parts = url.parse(req.url, true);
		var latlng = url_parts.query.latlng;
		var locationString = url_parts.query.locationString;
		console.log(latlng+", "+locationString);
		var requestUrl = "http://lesserthan.com/api.getDealsZip/06460/json";
		if(locationString!="null")
			requestUrl = "http://lesserthan.com/api.getDealsCity"+locationString+"json/?callback=?";
		if(latlng!="null"){
			var lat = latlng.split(',')[0];
			var lng = latlng.split(',')[1];
			requestUrl = "http://lesserthan.com/api.getDealsLatLon/json/?lat="+lat+"&lon="+lng;
		}
		console.log(requestUrl);
		request({"rejectUnauthorized":false, "url":requestUrl},function (error, response, body){
			if (!error && response.statusCode == 200) {
    		//console.log(response.body); 
			res.render('mymovewallet/localdeals',{
			title:'Movers',
			localdeals:JSON.parse(response.body)
			});
  			}
		});


		
	});

	app.get('/coupondetail', function(req,res){
		res.render('mymovewallet/coupondetail',{
		title:'Movers'
		});
	});

	app.get('/savedcoupondetail', function(req,res){
		res.render('mymovewallet/savedcoupondetail',{
		title:'Movers'
		});
	});
});

app.get('/api', function(req,res){
	 console.log(req.query.url);
	 request(req.query.url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    	//console.log(body) // Print the google web page.
    	res.end(body);
  }
})
}); 

app.get('/pbapi',function(req,res){
	request({"rejectUnauthorized":false, "url":'https://pitneybowes.pbondemand.com/location/travel/driving/getTravelBoundary.json?latitude=41.415863&longitude=-73.419368&cost=10&units=Miles&majorRoads=Y&returnHoles=Y&returnIslands=Y&simplificationFactor=0.75&appId=fea3c812-1036-4080-8903-9951d260b2e0'},function (error, response, body){
		if (!error && response.statusCode == 200) {
    	//console.log(response); // Print the google web page.
    	res.end(body);
  		}
	})
});

app.post('/sendLog',function(req,res){
		 console.log(req.body.data);

	// 	 request(req.query.url, function (error, response, body) {
	//   		if (!error && response.statusCode == 200) {
	//     	//console.log(body) // Print the google web page.
	//     	res.end(body);
	//   }
	// })
});


app.get('/heatmap', function(req,res){
	res.render('heatmap',{title:'Heatmap'});
});

app.get('/sxsw2014', function(req,res){
	res.render('sxsw2014',{title:'SXSW 2014'});
});

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//deprecated
function compare(a,b) {
	//console.log(a.createdAt); 
	if (a.createdAt< b.createdAt) {
		//console.log("<: "+a.expirationAt);
		return 1;
	}
	if (a.createdAt> b.createdAt) {
		//console.log("<: "+a.expirationAt);
		return -1;
	}
	return 0;
	}



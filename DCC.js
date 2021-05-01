var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var http = require("http");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/auth6');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}

});
app.get('/auth1', function(request, response) {
	response.sendFile(path.join(__dirname + '/signup.html'));
});
app.post('/auth2', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var id = request.body.id;
	var email = request.body.email;
        id=parseInt(id);
	if (username && password) {
		connection.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = "INSERT INTO accounts(id,username,password,email) VALUES ("+id+",' "+username+" ',' "+password+" ',' "+email+" ')";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                response.redirect('/auth5');
                 });
                });
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}

	
  
});


app.get('/auth6', function(request, response) {
	response.send("Welcome! ");
});

app.get('/auth5', function(request, response) {
	response.send("account created");
});
app.listen(3000);
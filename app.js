const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

//providing path for our static files / specifies static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us21.api.mailchimp.com/3.0/lists/6fc6666b56"

	const options = {
		method: "POST",
		auth: "daniel1:788990db5c67ce912ddc26b60cf800a8-us21"
	}

	const request = https.request(url, options, function(response) {
		response.on("data", function(data) {

			// console.log(JSON.parse(data));

			if(response.statusCode === 200) {
				res.sendFile(__dirname + "/success.html");
			} else {
				res.sendFile(__dirname + "/failure.html")
			}
		});
	});

	// request.write(jsonData);
	request.end();
});

app.post("/failure", function(req, res) {
	res.redirect("/");
});

app.listen(3000, function() {
	console.log("Server is running on port 3000");
});

//Mailchimp API key
// 788990db5c67ce912ddc26b60cf800a8-us21
//List ID
// 6fc6666b56

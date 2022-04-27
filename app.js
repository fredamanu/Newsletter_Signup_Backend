const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));// the css and images are local files so they are static. This is why we need to use the line of code and then create a folder called public to house the css folder and the images folder.
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
const firstName = req.body.firstname;
const lastName = req.body.lastname;
const email = req.body.email;
//Build the JS object that will be turned into a JSON data to be sent to mailchimp
const data = {
  members:[
    {
      email_address: email,
      status:"subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    },
  ]
};

const jsonData = JSON.stringify(data);
const url = "https://us14.api.mailchimp.com/3.0/lists/c6bcd76840"
const options ={
  method: "POST",
  auth: "freda1:26777cf73be9560f186e0d5e11b22735-us14"
}
const request = https.request(url, options, function(response){
  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname + "/failure.html");
  }
  response.on("data", function(data){
  console.log(JSON.parse(data));
});

  });
request.write(jsonData);
request.end();
});


app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT||3000, function(){
  console.log("Server is running on port 3000");
});

// console.log(firstName, lastName, email);// you can print more than one item by using "," to separate them.

// AUDIENCE ID: c6bcd76840
// API KEY: 26777cf73be9560f186e0d5e11b22735-us14

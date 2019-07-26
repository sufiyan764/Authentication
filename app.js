//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 5;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
	email : "String",
	password : "String"
});



const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
	res.render("home");
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	
		const hash = bcrypt.hashSync(req.body.password, saltRounds);
			const newUser = new User({
				email : req.body.username,
				password : hash
			});
			
			newUser.save(function(err){
				if(!err){
					res.render("secrets");
				} else {
					console.log(err);
				}
			});
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", function(req, res){
	User.findOne({email : req.body.username}, function(err, foundUser){
		if(!err){
			if(foundUser){
				const password = bcrypt.compareSync(req.body.password, foundUser.password);
				if(password){
					res.render("secrets");
				} else {
				
					res.send("Incorrect Password");
				}
			}else {
				
				res.send("Incorrect Email");
			}
			
		}else{
			console.log(err);
		}
	});
});

app.listen("3000", function(){
	console.log("Server running on port 3000 ");
});


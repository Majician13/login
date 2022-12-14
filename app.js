require('dotenv').config();
const express = require('express');
const bodyParser = require('body-Parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/register', function (req, res) {
	res.render('register');
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/register', function (req, res) {
	bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
		const newUser = new User({
			email: req.body.username,
			password: hash,
		});

		newUser.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				res.render('secrets');
			}
		});
	});
});

app.post('/login', function (req, res) {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ email: username }, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				if (foundUser.password === password) {
					res.render('secrets');
				}
			}
		}
	});
});

app.listen(8000, function () {
	console.log('Server started on port 8000.');
});

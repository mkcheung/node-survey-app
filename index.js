
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./models/User'); 
require('./models/Survey'); 
require('./services/passport'); 
const keys = require('./config/keys'); // if nothing is returned....

mongoose.connect(keys.mongoURI);

const app = express();


app.use(bodyParser.json());

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app); // requiring authRoutes gives back the function so it can immediately be called
require('./routes/billingRoutes')(app); 
require('./routes/surveyRoutes')(app); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

module.exports.app = app;
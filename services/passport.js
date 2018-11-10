const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
})

passport.deserializeUser( async (id, done) => {

	let user = await User.findById(id);
	done(null, user);
})


// set up the auth page from google (where the user can grant permission to utilize the app)
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback'
		}, async (accessToken, refreshToken, profile, done) => {

			const user = await User.findOne({
				googleId:profile.id
			});

			if(user){
				return done(null, user);
			} else {
				user = await new User({ googleId: profile.id }).save();
				done(null, user);
			}
		}
	)
);

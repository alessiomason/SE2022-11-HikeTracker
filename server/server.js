'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const userDao = require('./user-dao');
const passport = require('passport');   // authentication middleware
const LocalStrategy = require('passport-local').Strategy;   // username and password for login
const session = require('express-session');    // enable sessions
const APIs = require('./API');
require('dotenv').config();

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify email and password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        userDao.getUser(email, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Wrong email and/or password.' });
            else if (!user.verified)
                return done(null, false, { message: 'User not verified.' })
            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));


app.use(express.json({limit: '50mb'}));
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'Not authenticated!' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'A secret sentence not to share with anybody and anywhere, used to sign the session ID cookie.',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// expose the APIs
APIs.useAPIs(app, isLoggedIn);

// SESSION APIs

// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err) return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => res.end());
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated())
        res.status(200).json(req.user);
    else
        res.status(401).json({ error: 'User not authenticated!' });
});

// GET /sessions/current/access-right
// check whether the user is logged in or not
app.get('/api/sessions/current/access-right', async (req, res) => {
    try {
        const accessRight = await userDao.getUserAccessRight(req.user.id);
        res.status(200).json(accessRight);
    }
    catch (err) {
        res.status(500).end();
    }
});


// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
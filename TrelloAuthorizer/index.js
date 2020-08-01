const environment = require('./environment');
const Trello = require('./trello');

const JWTStrategy = require('@sap/xssec').JWTStrategy;
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const express = require('express');

// Access the xsuaa service
const uaaService = xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa;

// Make passport use read and access your JWT Tokens in the xsuaa service.
passport.use(new JWTStrategy(uaaService));

// Create the express server
const app = express();
// Apply the settings on the express server
app.use(passport.initialize());
app.use(passport.authenticate('JWT', {
    session: false
}));

// Trello object reference
this.oTrello = null;

// Run app and listen on port
const port = process.env.PORT || 3002;
app.listen(port, async () => {
    console.log('Trello Authorizer is listening on port: ' + port);

    // Get the environment variables
    const oEnvironmentVariables = await environment.getVariables();


    // Create a Trello object from the Trello Class=
    const oTrello = new Trello(oEnvironmentVariables);
    this.oTrello = oTrello;
});

// -----------------------------------
//  Express Server Endpoints
// -----------------------------------

// Root endpoint with welcome message
app.get("/", function (req, res) {
    res.send("Welcome to the Trello authorization Node.js app of the Trello CAP Timesheet Management project!");
});

app.get("/login", function (req, res) {
    return !this.oTrello.getCache().has(req.user.id) ? this.oTrello.login(req, res) : res.status(200).send({ message: "Already logged in and authorized by Trello." });
}.bind(this));

app.get("/loginCallback", function (req, res) {
    this.oTrello.loginCallback(req, res);
});

app.get('/getUserInfo', function (req, res) {
    // Read cache here already and if found continue, else return the login endpoint function.
    // The req.user.id holds the e-mail-address of the logged in user.
    return this.oTrello.getCache().has(req.user.id) ? this.oTrello.getUserInfo(req, res) : this.oTrello.unauthorizedAgainstTrello(res);
});

app.get("/getAllBoards", function (req, res) {
    return this.oTrello.getCache().has(req.user.id) ? this.oTrello.getAllBoards(req, res) : this.oTrello.unauthorizedAgainstTrello(res);
});

app.get("/getBoardById", function (req, res) {
    return this.oTrello.getCache().has(req.user.id) ? this.oTrello.getBoardById(req, res) : this.oTrello.unauthorizedAgainstTrello(res);
});

app.get("/getCardsByBoardId", function (req, res) {
    return this.oTrello.getCache().has(req.user.id) ? this.oTrello.getCardsByBoardId(req, res) : this.oTrello.unauthorizedAgainstTrello(res);
});

// trello.js
'use strict'; const OAuth = require('oauth').OAuth;
const NodeCache = require("node-cache");
const url = require('url');

module.exports = class Trello {
    constructor(config) {
        this.config = config;
        this.oAuth = new OAuth(this.getRequestURL(), this.getAccessURL(), this.getTrelloApiKey(), this.getTrelloApiSecret(), "1.0A", this.getLoginCallbackURL(), "HMAC-SHA1");
        this.cache = new NodeCache({
            stdTTL: 3600,
            checkperiod: 60,
            deleteOnExpire: true
        });

    }

    getCache() {
        return this.cache;
    }

    getOauth() {
        return this.oAuth;
    }

    getTrelloApiKey() {
        return this.config.trelloApiKey;
    }

    getTrelloApiSecret() {
        return this.config.trelloApiSecret;
    }

    getRequestURL() {
        return `${this.config.destinations.find(oDest => oDest.destinationConfiguration.Name === "TrelloOAuth").destinationConfiguration.URL}/OAuthGetRequestToken`;
    }

    getAccessURL() {
        return `${this.config.destinations.find(oDest => oDest.destinationConfiguration.Name === "TrelloOAuth").destinationConfiguration.URL}/OAuthGetAccessToken`;
    }

    getAuthorizeURL() {
        return `${this.config.destinations.find(oDest => oDest.destinationConfiguration.Name === "TrelloOAuth").destinationConfiguration.URL}/OAuthAuthorizeToken`;
    }

    getLoginCallbackURL() {
        return `${this.config.destinations.find(oDest => oDest.destinationConfiguration.Name === "trello-cap-timesheetmanagement-approuter").destinationConfiguration.URL}/TrelloAuthorizer/loginCallback`;
    }

    getApprouterURL() {
        return `${this.config.destinations.find(oDest => oDest.destinationConfiguration.Name === "trello-cap-timesheetmanagement-approuter").destinationConfiguration.URL}`;
    }

    getTrelloAPI() {
        return this.config.destinations.find(oDest => oDest.destinationConfiguration.Name === "TrelloAPI").destinationConfiguration.URL;
    }

    getTrelloAppName() {
        return this.config.trelloApiAppName;
    }

    getTrelloScope() {
        return this.config.trelloApiScope;
    }

    getTrelloExpiration() {
        return this.config.trelloApiExpiration;
    }

    // Return an unauthorized message to the requestor
    unauthorizedAgainstTrello(res) {
        return res.status(401).send({ message: "Please first authenticate and authorize against the Trello APIs." });
    }

    // Login and fetch tokens (authenticate and authorize)
    login(req, res) {
        this.getOauth().getOAuthRequestToken(function (error, token, tokenSecret) {
            // This key is only needed temporary, it is set here and later on removed again in the callback function with 
            this.getCache().set(token, tokenSecret);
            return res.redirect(`${this.getAuthorizeURL()}?oauth_token=${token}&name=${this.getTrelloAppName()}&scope=${this.getTrelloScope()}&expiration=${this.getTrelloExpiration()}`);
        }.bind(this));
    }

    loginCallback(req, res) {
        //Read query params to get OAuth Access Token
        const query = url.parse(req.url, true).query;
        const token = query.oauth_token;

        // taken() on the cache is the equivalent to calling get(key) + del(key).
        const tokenSecret = this.getCache().take(token);
        const verifier = query.oauth_verifier;

        this.getOauth().getOAuthAccessToken(token, tokenSecret, verifier, function (error, accessToken, accessTokenSecret) {

            // Here we have the accessToken and accessTokenSecret. Put them to the cache. 
            //The expiration (stdTTL) is passed to the constructor of the cache and does not have to be set again.
            // The key is the e-mail-address.

            const oTokens = {
                accessToken: accessToken,
                accessTokenSecret: accessTokenSecret
            };

            // Cache the user his tokens
            this.getCache().set(req.user.id, oTokens);

            // Return the user back to the HTML5 Module
            res.redirect(this.getApprouterURL());
        }.bind(this));
    }

    // Get the userInfo
    getUserInfo(req, res) {
        const cachedUser = this.getCache().get(req.user.id);
        const accessToken = cachedUser.accessToken;
        const accessTokenSecret = cachedUser.accessTokenSecret;
        this.getOauth().getProtectedResource(`${this.getTrelloAPI()}/members/me`, "GET", accessToken, accessTokenSecret, function (error, data) {
            res.send(data);
        });
    }

    // Get all the boards
    getAllBoards(req, res) {
        const cachedUser = this.getCache().get(req.user.id);
        const accessToken = cachedUser.accessToken;
        const accessTokenSecret = cachedUser.accessTokenSecret;

        this.getOauth().getProtectedResource(`${this.getTrelloAPI()}/members/me/boards`, "GET", accessToken, accessTokenSecret, function (error, data) {
            res.send(data);
        });
    }

    // Get a board by id
    getBoardById(req, res) {
        const cachedUser = this.getCache().get(req.user.id);
        const accessToken = cachedUser.accessToken;
        const accessTokenSecret = cachedUser.accessTokenSecret;

        //Read query params => Example: http://localhost:3000/getBoardById?boardId=YOUR-BOARD-ID
        const query = url.parse(req.url, true).query;

        // Read query param key = boardId and YOUR-BOARD-ID = value
        const boardId = query.boardId;

        // Set url 
        const boardUrl = `${this.getTrelloAPI()}/boards/${boardId}`;

        // Get data
        this.getOauth().getProtectedResource(boardUrl, "GET", accessToken, accessTokenSecret, function (error, data) {
            res.send(data);
        });
    }

    // Get a cards by boardId (same logic as above)
    getCardsByBoardId(req, res) {
        const cachedUser = this.getCache().get(req.user.id);
        const accessToken = cachedUser.accessToken;
        const accessTokenSecret = cachedUser.accessTokenSecret;

        const query = url.parse(req.url, true).query;
        const boardId = query.boardId;
        const boardUrl = `${this.getTrelloAPI()}/boards/${boardId}/cards`;
        this.getOauth().getProtectedResource(boardUrl, "GET", accessToken, accessTokenSecret, function (error, data) {
            res.send(data);
        });
    }

}

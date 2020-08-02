sap.ui.define([
    "./CoreService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (CoreService, Filter, FilterOperator) {
    "use strict";

    var TrelloService = CoreService.extend("cap.trello.TimesheetManager.service.TrelloService", {

        constructor: function () { },

        setModel: function (model) {
            this.model = model;
        },

        logIn: function () {
            return window.open("/TrelloAuthorizer/login", "_self");
        },

        getCurrentUser: function () {
            return this.http("/TrelloAuthorizer/getUserInfo").get().then(function (user) {
                return JSON.parse(user);
            }).catch(function () {
                return this.logIn();
            }.bind(this));
        },

        getBoards: function () {
            return this.http("/TrelloAuthorizer/getAllBoards").get().then(function (boards) {
                return JSON.parse(boards);
            });
        },

        getBoardById: function (boardId) {
            return this.http("/TrelloAuthorizer/getBoardById?boardId=" + boardId).get().then(function (board) {
                return JSON.parse(board);
            });
        },

        getBoardCards: function (boardId) {
            return this.http("/TrelloAuthorizer/getCardsByBoardId?boardId=" + boardId).get().then(function (cards) {
                return JSON.parse(cards);
            });
        }
    });
    return new TrelloService();
});

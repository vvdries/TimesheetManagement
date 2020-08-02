/* global _:true */
sap.ui.define([
    "../object/BaseObject",
    "../service/TrelloService",
    "../object/UserObject"
], function (BaseObject, TrelloService, UserObject) {
    "use strict";
    var UserState = BaseObject.extend("cap.trello.TimesheetManager.state.UserState", {

        oUser: null,

        constructor: function (data) {
            BaseObject.call(this, data);
        },

        setUser: function (oUser) {
            this.oUser = oUser;
            this.updateModel();
        },

        getCurrentUser: function () {
            return this.oUser;
        },

        loadCurrentUser: function () {
            if (this.oUser) {
                return Promise.resolve(this.oUser);
            }

            return TrelloService.getCurrentUser().then(function (user) {
                this.setUser(new UserObject(user));
                return this.oUser;
            }.bind(this));
        }

    });
    return new UserState();
});

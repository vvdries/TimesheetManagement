/* global _:true */
sap.ui.define([
    "./BaseObject",
], function (BaseObject) {
    "use strict";
    return BaseObject.extend("cap.trello.TimesheetManager.object.UserObject", {
        constructor: function (data) {
            // When a user object is created the url for the avatar need to be extended with "/50.png"
            // This to point to the correct avatar url. Because there are multiple sizes available.
            data.avatarUrl = this.convertAvatarUrl50(data.avatarUrl);
            BaseObject.call(this, data);
        },

        convertAvatarUrl50: function (avatarUrl) {
            return avatarUrl + "/50.png";
        },

        getFullName: function () {
            return this.fullName;
        }

    });
});

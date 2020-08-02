/* global _:true */
sap.ui.define([
    "./BaseObject",
    "./SpentHourObject"
], function (BaseObject, SpentHourObject) {
    "use strict";
    return BaseObject.extend("cap.trello.TimesheetManager.object.CardObject", {
        constructor: function (data) {
            BaseObject.call(this, data);
        },

        getId: function () {
            return this.id;
        },

        getUrl: function () {
            return this.url;
        },

        getSpentHours: function () {
            return this.spentHours;
        },

        setSpentHours: function (aSpentHours) {
            this.spentHours = aSpentHours.map(function (spentHour) {
                // spentHour.date = new Date(spentHour.date);
                return new SpentHourObject(spentHour);
            });
        }

    });
});

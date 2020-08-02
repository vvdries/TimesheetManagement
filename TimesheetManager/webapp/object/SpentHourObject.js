/* global _:true */
sap.ui.define([
    "./BaseObject"
], function (BaseObject) {
    "use strict";
    return BaseObject.extend("cap.trello.TimesheetManager.object.SpentHourObject", {
        constructor: function (data) {
            BaseObject.call(this, data);
            if (data) {
                this.date = new Date(data.date);
            }
        },

        getId: function () {
            return this.ID;
        },

        setId: function (ID) {
            this.ID = ID;
        },

        setBoardId: function (boardId) {
            this.boardId = boardId;
        },

        setCardId: function (cardId) {
            this.cardId = cardId;
        },

        setFullName: function (fullName) {
            this.fullName = fullName;
        },

        getJSON: function () {
            return {
                boardId: this.boardId,
                cardId: this.cardId,
                date: this.date,
                fullName: this.fullName,
                hours: this.hours.toString(),
                status: this.status,
                comment: this.comment
            };
        }

    });
});

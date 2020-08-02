/* global _:true */
sap.ui.define([
    "./BaseObject",
    "./CardObject"
], function (BaseObject, CardObject) {
    "use strict";
    return BaseObject.extend("cap.trello.TimesheetManager.object.BoardObject", {
        constructor: function (data) {
            BaseObject.call(this, data);
        },

        getId: function () {
            return this.id;
        },

        getName: function () {
            return this.name;
        },

        getUrl: function () {
            return this.url;
        },
        getCards: function () {
            return this.cards;
        },

        setCards: function (aCards) {
            this.cards = aCards.map(function (card) {
                return new CardObject(card);
            });
        }

    });
});

/* global moment: true */
sap.ui.define([], function () {
    "use strict";
    return {
        getTrelloIcon: function (oCurrentCard) {
            return sap.ui.require.toUrl("cap/trello/TimesheetManager/images/trello-mark-blue.png");
        },

        // Set sate color for due date if expired or not
        checkDueDateStatus: function (dueDate) {
            if (dueDate) {
                var oDueDate = new Date(dueDate);
                if (new Date() > oDueDate) {
                    return "Error";
                } else {
                    return "Warning";
                }
            }
            return "Success";
        },

        // Set sate inverted color for due date if expired or not
        checkDueDateStatusInverted: function (dueDate) {
            if (dueDate) {
                var oDueDate = new Date(dueDate);
                if (new Date() > oDueDate) {
                    return "Indication01";
                } else {
                    return "Indication03";
                }
            }
            return "Indication04";
        },

        checkDueDateText: function (dueDate) {
            var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            if (dueDate) {
                var oDueDate = new Date(dueDate);
                if (new Date() > oDueDate) {
                    return i18n.getText("duePassed");
                } else {
                    return i18n.getText("dueNotPassed");
                }
            }
            return i18n.getText("noDeadLineSet");
        },

        emptyDueDate: function (dueDate) {
            var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            if (dueDate) {
                return dueDate;
            }
            return i18n.getText("noDeadLineSet");
        },
        spentHourStatus: function (status) {
            var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            return i18n.getText(status);
        }

    };
});

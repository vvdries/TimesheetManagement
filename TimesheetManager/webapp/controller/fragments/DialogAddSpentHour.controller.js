sap.ui.define([
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "../../state/BoardState",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, BoardState, MessageBox) {
    "use strict";
    return BaseController.extend("cap.trello.TimesheetManager.controller.fragments.DialogAddSpentHour", {
        onBeforeShow: function (parent, fragment, callback, data) {
            this.parent = parent;
            this.fragment = fragment;
            this.callback = callback;

            this.i18n = this.parent.getModel("i18n").getResourceBundle();

            var oSpentHour = data.isNewSpentHour === true ? {} : data.oSpentHour;

            var dialogmodel = new JSONModel({
                title: data.title,
                isNewSpentHour: data.isNewSpentHour,
                oSpentHour: oSpentHour,
                possibleStatus: [{
                    id: "Done",
                    status: this.i18n.getText("Done")
                }, {
                    id: "Ongoing",
                    status: this.i18n.getText("Ongoing")
                }, {
                    id: "OnHold",
                    status: this.i18n.getText("OnHold")
                }]
            });
            this.fragment.setModel(dialogmodel, "DialogAddSpentHourModel");
        },

        submitForm: function () {
            if (this.spentHourIsValid()) {
                var oSpentHour = this.fragment.getModel("DialogAddSpentHourModel").getProperty("/oSpentHour");
                this.showBusyIndicator();
                this.fragment.close();
                return this.callback.call(this.parent, oSpentHour);
            }

            var me = this;
            return MessageBox.error(me.i18n.getText("fillInRequiredFieldsSpentHour"));
        },

        spentHourIsValid: function () {
            var date = this.fragment.getModel("DialogAddSpentHourModel").getProperty("/oSpentHour/date");
            var hours = this.fragment.getModel("DialogAddSpentHourModel").getProperty("/oSpentHour/hours");
            var status = this.fragment.getModel("DialogAddSpentHourModel").getProperty("/oSpentHour/status");

            return date && hours && status ? true : false;
        },

        // Set the selecte date time on change
        handleSpentHoursDateChange: function (oEvent) {
            var oSpendHour = oEvent.getSource().getModel("DialogAddSpentHourModel").getContext("/oSpentHour").getObject();
            oSpendHour.date = oEvent.getSource().getDateValue();
        },

        onClose: function () {
            this.fragment.close();
        }
    });
});

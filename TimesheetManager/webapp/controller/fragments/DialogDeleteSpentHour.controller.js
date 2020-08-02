sap.ui.define([
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "../../state/BoardState",
], function (BaseController, JSONModel, BoardState) {
    "use strict";
    return BaseController.extend("cap.trello.TimesheetManager.controller.fragments.DialogDeleteSpentHour", {
        onBeforeShow: function (parent, fragment, callback, data) {
            this.parent = parent;
            this.fragment = fragment;
            this.callback = callback;

            var dialogmodel = new JSONModel({
                title: data.title
            });
            this.fragment.setModel(dialogmodel, "DialogDeleteSpentHourModel");

            //read label control from dialog in fragment
            //var label = this.getFragmentControlById(this.parent, "label1");
        },

        onDeleteSpentHour: function () {
            this.showBusyIndicator();
            this.fragment.close();
            this.callback.call(this.parent);
        },

        onClose: function () {
            this.fragment.close();
        }
    });
});

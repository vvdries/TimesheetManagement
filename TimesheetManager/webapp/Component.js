sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "cap/trello/TimesheetManager/model/models",
    "cap/trello/TimesheetManager/state/UserState"
], function (UIComponent, Device, models, UserState) {
    "use strict";

    return UIComponent.extend("cap.trello.TimesheetManager.Component", {

        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Set the model and get the current user, if model not set here avatar picture not set
            this.setModel(UserState.getModel(), "UserState");
            UserState.loadCurrentUser();

            // force fiori 3 dark in Fiori Launchpad Sandbox environment
            sap.ui.getCore().applyTheme("sap_fiori_3_dark");
        }
    });
});

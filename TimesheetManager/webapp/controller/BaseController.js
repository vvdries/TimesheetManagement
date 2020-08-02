/*global history */
var _fragments = [];
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    'sap/m/Button',
    'sap/m/Dialog'
], function (Controller, History, Button, Dialog) {
    "use strict";

    return Controller.extend("cap.trello.TimesheetManager.controller.BaseController", {

        onInit: function () { },
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },
        getEventBus: function () {
            return this.getOwnerComponent().getEventBus();
        },

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle(); // this.getView().getModel("i18n"); //
        },

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            try {
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            } catch (ex) {
                this.getRouter().navTo("master", {}, true);
                return;
            }
            if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
                history.go(-1);
            } else {
                this.getRouter().navTo("master", {}, true);
            }
        },

        i18n: function (sProperty) {
            return this.getResourceBundle().getText(sProperty);
        },

        fnMetadataLoadingFailed: function () {
            var dialog = new Dialog({
                title: 'Error',
                type: 'Message',
                state: 'Error',
                content: new Text({
                    text: 'Metadata loading failed. Please refresh you page.'
                }),
                beginButton: new Button({
                    text: 'OK',
                    press: function () {
                        dialog.close();
                    }
                }),
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        openFragment: function (sName, model, updateModelAlways, callback, data) {
            if (sName.indexOf(".") > 0) {
                var aViewName = sName.split(".");
                sName = sName.substr(sName.lastIndexOf(".") + 1);
            } else { //current folder
                aViewName = this.getView().getViewName().split("."); // view.login.Login
            }
            aViewName.pop();
            var sViewPath = aViewName.join("."); // view.login
            if (sViewPath.toLowerCase().indexOf("fragments") > 0) {
                sViewPath += ".";
            } else {
                sViewPath += ".fragments.";
            }
            var id = this.getView().getId() + "-" + sName;
            if (!_fragments[id]) {
                //create controller
                var sControllerPath = sViewPath.replace("view", "controller");
                try {
                    var controller = sap.ui.controller(sControllerPath + sName);
                } catch (ex) {
                    controller = this;
                }
                _fragments[id] = {
                    fragment: sap.ui.xmlfragment(
                        id,
                        sViewPath + sName,
                        controller
                    ),
                    controller: controller
                };
                if (model && !updateModelAlways) {
                    _fragments[id].fragment.setModel(model);
                }
                // version >= 1.20.x
                this.getView().addDependent(_fragments[id].fragment);
            }
            var fragment = _fragments[id].fragment;
            if (model && updateModelAlways) {
                fragment.setModel(model);
            }
            if (_fragments[id].controller && _fragments[id].controller !== this) {
                _fragments[id].controller.onBeforeShow(this, fragment, callback, data);
            }

            setTimeout(function () {
                fragment.open();
            }, 100);
        },

        closeFragments: function () {
            for (var f in _fragments) {
                if (_fragments[f]["fragment"] && _fragments[f].fragment["isOpen"] && _fragments[f].fragment.isOpen()) {
                    _fragments[f].fragment.close();
                }
            }
        },

        getFragmentControlById: function (parent, id) {
            var latest = this.getMetadata().getName().split(".")[this.getMetadata().getName().split(".").length - 1];
            return sap.ui.getCore().byId(parent.getView().getId() + "-" + latest + "--" + id);
        },

        showBusyIndicator: function () {
            return sap.ui.core.BusyIndicator.show();
        },

        hideBusyIndicator: function () {
            return sap.ui.core.BusyIndicator.hide();
        }

    });

});

sap.ui.define([
    "./BaseController",
    "../state/UserState",
    "../state/BoardState",
    "sap/ui/core/routing/History",
    "../model/Formatter",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    'sap/ui/export/Spreadsheet',
    "sap/m/MessageToast"
], function (BaseController, UserState, BoardState, History, Formatter, Filter, FilterOperator, Spreadsheet, MessageToast) {
    "use strict";

    return BaseController.extend("cap.trello.TimesheetManager.controller.Cards", {

        formatter: Formatter,

        onInit: function () {
            // Set the user model to the view
            this.setModel(UserState.getModel(), "UserState");

            // Set the board model to the view
            this.setModel(BoardState.getModel(), "BoardState");

            // Attach a private event listener function _onRouteMatched to the matched event of this route.
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Cards").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            // Get the current user
            UserState.loadCurrentUser();
            var boardId = oEvent.getParameter("arguments").boardId;
            BoardState.loadCurrentBoard(boardId).then(function (board) {
                BoardState.loadBoardCards(board.getId()).then(function () {
                    this.hideBusyIndicator();
                }.bind(this));
            }.bind(this));
        },

        // Navigate back
        onNavBack: function () {
            this.showBusyIndicator();
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Boards", true);
            }
        },

        onCardSearch: function (oEvent) {
            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {

                var filter = new Filter({
                    filters: [
                        new Filter("name", FilterOperator.Contains, sQuery),
                        new Filter("desc", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                });
                aFilters.push(filter);
            }
            // update list binding
            var list = this.byId("listCards");
            var binding = list.getBinding("items");
            binding.filter(aFilters, "Application");
        },

        // On card select show details
        onCardSelect: function (oEvent) {
            var oSource = oEvent.getSource();
            var oCard = oSource.getSelectedItem().getBindingContext("BoardState").getObject();
            BoardState.setCurrentCard(oCard);
        },

        toTrelloCard: function (oEvent) {
            var oSource = oEvent.getSource();
            var trelloCardUrl = oSource.getBindingContext("BoardState").getObject().getUrl();
            window.open(trelloCardUrl, '_blank');
        },
        onAddSpentHour: function (oEvent) {
            var i18n = this.getModel("i18n").getResourceBundle();
            this.openFragment(
                "DialogAddSpentHour",
                null,
                true,
                this.addSpentHour,
                {
                    title: i18n.getText("addSpentHour"),
                    isNewSpentHour: true
                }
            );
        },

        addSpentHour: function (oSpentHour) {
            BoardState.addSpentHour(oSpentHour).then(function (response) {
                this.hideBusyIndicator();
            }.bind(this));
        },

        onDeleteSpentHour: function (oEvent) {
            var i18n = this.getModel("i18n").getResourceBundle();
            var oSpentHour = oEvent.getSource().getBindingContext("BoardState").getObject();
            BoardState.setCurrentSpenthour(oSpentHour);
            this.openFragment(
                "DialogDeleteSpentHour",
                null,
                true,
                this.deleteSpentHour,
                {
                    title: i18n.getText("deleteSpentHour")
                }
            );
        },

        deleteSpentHour: function () {
            var oSpentHour = BoardState.getCurrentSpentHour();
            BoardState.deleteSpentHour(oSpentHour).then(function (response) {
                this.hideBusyIndicator();
            }.bind(this));
        },

        onEditSpentHour: function (oEvent) {
            var oSpentHour = oEvent.getSource().getBindingContext("BoardState").getObject();
            BoardState.setCurrentSpenthour(oSpentHour);
            var i18n = this.getModel("i18n").getResourceBundle();
            this.openFragment(
                "DialogAddSpentHour",
                null,
                true,
                this.editSpentHour, {
                title: i18n.getText("editSpentHour"),
                isNewSpentHour: false,
                oSpentHour: oSpentHour
            });
        },

        editSpentHour: function (oSpentHour) {
            BoardState.editSpentHour(oSpentHour).then(function (response) {
                this.hideBusyIndicator();
            }.bind(this));
        },
        onExcelExport: function () {
            var aCols = BoardState.getColumnConfig();
            var date = new Date().toLocaleDateString();
            var fileName = BoardState.getCurrentBoard().getName() + " - " + date + ".xlsx";
            var me = this;
            BoardState.getMonthlyExcelExportData().then(function (result) {
                var oSettings = {
                    workbook: {
                        columns: aCols
                    },
                    dataSource: result,
                    fileName: fileName
                };
                var oSheet = new Spreadsheet(oSettings);
                // Build and export spreadsheet
                oSheet.build().then(function () {
                    var i18n = me.getModel("i18n").getResourceBundle();
                    MessageToast.show(i18n.getText("TimesheetExportFinished"));
                }.bind(this)).finally(function () {
                    oSheet.destroy();
                });
            });
        }
    });
});

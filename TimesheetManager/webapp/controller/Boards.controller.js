sap.ui.define([
    "./BaseController",
    "../state/BoardState",
    "../model/Formatter"
], function (BaseController, BoardState, Formatter) {
    "use strict";

    return BaseController.extend("cap.trello.TimesheetManager.controller.Boards", {

        formatter: Formatter,

        onInit: function () {
            // Set baord state to the view
            this.setModel(BoardState.getModel(), "BoardState");

            var oRouter = this.getRouter();
            oRouter.getRoute("Boards").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            this.showBusyIndicator();
            // Get all the user's boards
            BoardState.loadBoards().then(function () {
                this.hideBusyIndicator();
            }.bind(this));
        },
        onBoardPress: function (oEvent) {
            this.showBusyIndicator();

            // Get the selected board object from the BoardState based on its bindingContext against the ovent source
            var oBoard = oEvent.getSource().getBindingContext("BoardState").getObject();

            // Set the current board in the board state
            BoardState.setCurrentBoard(oBoard);

            // Next nav to the detail page with all the card
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Cards", {
                boardId: oBoard.id
            });
        },

        toTrelloBoard: function (oEvent) {
            var oSource = oEvent.getSource();
            var trelloBoardUrl = oSource.getBindingContext("BoardState").getObject().getUrl();
            window.open(trelloBoardUrl, '_blank');
        },
    });
});

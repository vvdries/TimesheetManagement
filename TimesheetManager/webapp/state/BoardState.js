/* global _:true */
sap.ui.define([
    "../object/BaseObject",
    "../service/TrelloService",
    "../object/BoardObject",
    "../object/CardObject",
    "../service/TimesheetManagementService",
    "../object/SpentHourObject",
    "./UserState"
], function (BaseObject, TrelloService, BoardObject, CardObject, TimesheetManagementService, SpentHourObject, UserState) {
    "use strict";
    var BoardState = BaseObject.extend("cap.trello.TimesheetManager.state.BoardState", {

        aBoards: [],
        oCurrentBoard: null,
        oCurrentCard: null,
        oCurrentSpentHour: null,

        constructor: function (data) {
            BaseObject.call(this, data);
        },

        loadBoards: function () {
            if (this.aBoards.length > 0) {
                return Promise.resolve(this.aBoards);
            }
            return TrelloService.getBoards().then(function (boards) {
                var aBoards = boards.map(function (oBoard) {
                    return new BoardObject(oBoard);
                });
                this.setBoards(aBoards);
                return this.aBoards;
            }.bind(this));
        },

        loadCurrentBoard: function (boardId) {
            if (this.oCurrentBoard) {
                return Promise.resolve(this.oCurrentBoard);
            }
            return this.getCurrentBoardById(boardId);
        },

        getCurrentBoardById: function (boardId) {
            return TrelloService.getBoardById(boardId).then(function (board) {
                var oBoard = new BoardObject(board);
                this.setCurrentBoard(oBoard);
                return this.oCurrentBoard;
            }.bind(this));
        },

        setCurrentBoard: function (oBoard) {
            this.oCurrentBoard = oBoard;
            this.updateModel();
        },

        setBoards: function (boards) {
            this.aBoards = boards;
            this.updateModel();
        },

        loadBoardCards: function (boardId) {
            return this.loadCurrentBoard(boardId).then(function (board) {
                if (board.getCards()) {
                    return Promise.resolve(this.oCurrentBoard);
                }
                return TrelloService.getBoardCards(boardId).then(function (cards) {
                    var aCards = cards.map(function (oCard) {
                        return new CardObject(oCard);
                    });
                    return this.setBoardCards(aCards);
                }.bind(this));
            }.bind(this));
        },

        setBoardCards: function (aCards) {
            this.getCurrentBoard().setCards(aCards);
            this.updateModel();
        },

        getCurrentBoard: function () {
            return this.oCurrentBoard;
        },

        setCurrentCard: function (oCard) {
            this.oCurrentCard = oCard;
            this.getCardSpentHours(this.oCurrentBoard.getId(), this.oCurrentCard.getId()).then(function (spentHours) {
                this.updateModel();
                return spentHours;
            }.bind(this));
            this.updateModel();
        },

        getCardSpentHours: function (boardId, cardId) {
            if (this.getCurrentCard().getSpentHours()) {
                return Promise.resolve(this.getCurrentCard().getSpentHours());
            }
            return TimesheetManagementService.getCardSpentHours(boardId, cardId).then(function (aSpentHours) {
                this.oCurrentCard.setSpentHours(aSpentHours);
                return this.oCurrentCard.getSpentHours();
            }.bind(this));
        },
        getCurrentCard: function () {
            return this.oCurrentCard;
        },

        addSpentHour: function (oSpentHour) {
            oSpentHour = new SpentHourObject(oSpentHour);
            // oSpentHour.setId("0");
            oSpentHour.setBoardId(this.getCurrentBoard().getId());
            oSpentHour.setCardId(this.getCurrentCard().getId());
            oSpentHour.setFullName(UserState.getCurrentUser().getFullName());
            return TimesheetManagementService.addSpentHour(oSpentHour).then(function (response) {
                response = JSON.parse(response);
                oSpentHour.setId(response.ID);
                this.getCurrentCard().getSpentHours().push(oSpentHour);
                this.updateModel();
                return this.getCurrentCard();
            }.bind(this)).catch(function (oError) {
                console.log(oError.message);
            }.bind(this));
        },

        setCurrentSpenthour: function (oSpentHour) {
            this.oCurrentSpentHour = oSpentHour;
            this.updateModel();
        },

        getCurrentSpentHour: function () {
            return this.oCurrentSpentHour;
        },

        deleteSpentHour: function (oSpentHour) {
            return TimesheetManagementService.deleteSpentHour(oSpentHour.getId()).then(function (response) {
                var aSpentHours = this.getCurrentCard().getSpentHours();
                var index = aSpentHours.map(function (spentHour) {
                    return spentHour.ID;
                }).indexOf(oSpentHour.getId());
                aSpentHours.splice(index, 1);
                this.updateModel();
                return this.getCurrentCard();
            }.bind(this, oSpentHour.getId()));
        },

        editSpentHour: function (oSpentHour) {
            return TimesheetManagementService.editSpentHour(oSpentHour).then(function (response) {
                this.updateModel();
                return this.getCurrentCard();
            }.bind(this));
        },
        getColumnConfig: function () {
            var columnConfig = [{
                label: 'Card name',
                property: 'cardName',
                type: 'String'
            }, {
                label: 'Card description',
                property: 'cardDesc',
                type: 'String'
            },
            {
                label: 'Spent date',
                property: 'date',
                type: 'datetimeoffset'
            },
            {
                label: 'Spent hours',
                property: 'hours',
                type: 'Number'
            },
            {
                label: 'Current status',
                property: 'status',
                type: 'String'
            },
            {
                label: 'Spent by user',
                property: 'fullName',
                type: 'String'
            },
            {
                label: 'Comment',
                property: 'comment',
                type: 'String'
            }
            ];

            return columnConfig;
        },

        getMonthlyExcelExportData: function () {
            return TimesheetManagementService.getMonthlyExcelExportData(this.getCurrentBoard().getId()).then(function (aSpentHours) {
                aSpentHours = JSON.parse(aSpentHours).value;
                var aCards = this.getCurrentBoard().getCards();

                var aResult = aSpentHours.map(function (oSpentHour) {
                    var indexCard = aCards.map(function (card) {
                        return card.id;
                    }).indexOf(oSpentHour.cardId);
                    oSpentHour.cardName = aCards[indexCard].name;
                    oSpentHour.cardDesc = aCards[indexCard].desc;
                    return oSpentHour;
                });

                return aResult;
            }.bind(this));
        }


    });
    return new BoardState();
});

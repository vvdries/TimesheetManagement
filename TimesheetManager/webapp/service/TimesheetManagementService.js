sap.ui.define([
    "./CoreService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (CoreService, Filter, FilterOperator) {
    "use strict";

    var TimesheetManagementService = CoreService.extend("cap.trello.TimesheetManager.service.TimesheetManagementService", {

        constructor: function () { },

        setModel: function (model) {
            this.model = model;
        },

        getCardSpentHours: function (boardId, cardId) {
            return this.http("/timesheetService/SpentHours?$filter=boardId eq '" + boardId + "' and cardId eq '" + cardId + "'").get()
                .then(function (
                    aSpentHours) {
                    return JSON.parse(aSpentHours).value;
                });
        },

        addSpentHour: function (oSpentHour) {
            return this.http("/timesheetService/SpentHours").post(false, oSpentHour.getJSON());
        },

        deleteSpentHour: function (spentHourId) {
            return this.http("/timesheetService/SpentHours(" + spentHourId + ")").delete();
        },

        editSpentHour: function (oSpentHour) {
            return this.http("/timesheetService/SpentHours(" + oSpentHour.getId() + ")").put(false, oSpentHour.getJSON());
        },

        getMonthlyExcelExportData: function (boardId) {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
            var aFilters = [];
            var oFilter = new Filter({
                filters: [
                    new Filter("boardId", FilterOperator.EQ, boardId),
                    new Filter("date", FilterOperator.GE, firstDay),
                    new Filter("date", FilterOperator.LT, lastDay)
                ],
                and: true
            });

            aFilters.push(oFilter);

            var args = {
                "$filter": "boardId eq '" + boardId + "' and date gt " + firstDay + " and date lt " + lastDay
            };

            return this.http("/timesheetService/SpentHours").get(false, args);
        }

    });
    return new TimesheetManagementService();
});

namespace TrelloTimesheetManagementCAP.db;

entity SpentHours {
    key ID       : UUID;
        boardId  : String;
        cardId   : String;
        date     : DateTime;
        hours    : Decimal(4, 2);
        status   : String;
        fullName : String;
        comment  : String;
}

using TrelloTimesheetManagementCAP.db from '../db/data-model';

service TimesheetManagementService @(requires:'authenticated-user'){
  entity SpentHours @(restrict: [{ grant: '*', to: 'authenticated-user' }]) as projection on db.SpentHours;
}

/*global QUnit*/

sap.ui.define([
	"cap/trello/TimesheetManager/controller/Boards.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Boards Controller");

	QUnit.test("I should test the Boards controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

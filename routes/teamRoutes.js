const express = require("express");
const router = express.Router();

const createTeamController = require("../controllers/teamController.js").createTeamController;
const getTeamsController = require("../controllers/teamController.js").getTeamsController;
const sendTeamcodeController = require("../controllers/teamController.js").sendTeamcodeController;
const joinTeamController = require("../controllers/teamController.js").joinTeamController;
const getTeamByCodeController = require("../controllers/teamController.js").getTeamByCodeController;
const addTaskController = require("../controllers/teamController.js").addTaskController;
const taskCompletedController = require("../controllers/teamController.js").taskCompletedController;
const deleteMemberController = require("../controllers/teamController.js").deleteMemberController;


router.post("/createTeam",createTeamController );

router.get("/showTeams", getTeamsController );

router.post("/sendTeamcode/:teamId/:domainName",sendTeamcodeController );

router.post("/joinTeam",joinTeamController );

router.get("/getTeam/:teamCode", getTeamByCodeController);


router.post("/task/:teamCode", addTaskController);

router.post("/taskDone", taskCompletedController);

router.post("/deleteMember/:teamId",deleteMemberController);


module.exports = router;

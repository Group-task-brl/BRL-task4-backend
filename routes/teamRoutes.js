const express = require("express");
const router = express.Router();

const createTeamController = require("../controllers/teamController.js").createTeamController;
const getTeamsController = require("../controllers/teamController.js").getTeamsController;
const sendTeamcodeController = require("../controllers/teamController.js").sendTeamcodeController;
const joinTeamController = require("../controllers/teamController.js").joinTeamController;


router.post("/createTeam",createTeamController );

router.get("/showTeams", getTeamsController );

router.post("/sendTeamcode/:teamId/:domainName",sendTeamcodeController );

router.post("/joinTeam",joinTeamController );



module.exports = router;

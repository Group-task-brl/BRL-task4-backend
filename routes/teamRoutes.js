const express = require("express");
const router = express.Router();

const createTeamController = require("../controllers/teamController.js").createTeamController;
const getTeamsController = require("../controllers/teamController.js").getTeamsController;
const sendTeamcodeController = require("../controllers/teamController.js").sendTeamcodeController;


router.post("/createTeam",createTeamController );

router.get("/showTeams/:email", getTeamsController );

router.post("/sendTeamcode/:teamId/:domainName",sendTeamcodeController );



module.exports = router;

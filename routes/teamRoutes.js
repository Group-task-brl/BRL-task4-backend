const express = require("express");
const router = express.Router();

const createTeamController = require("../controllers/teamController.js").createTeamController;
const getTeamsController = require("../controllers/teamController.js").getTeamsController;


router.post("/createTeam",createTeamController );

router.get("/showTeams/:email", getTeamsController );



module.exports = router;

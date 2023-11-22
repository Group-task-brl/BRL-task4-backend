

const User = require('../models/userModel.js');
const Team = require('../models/teamModel.js');



function generateTeamCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let teamCode = '';
    for (let i = 0; i < 6; i++) {
      teamCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return teamCode;
  }

const createTeamController = async (req, res) => {
    const { leaderId, teamName, domains } = req.body;

  try {
    // Validate that the leader exists
    // const leader = await User.findById(leaderId);
    // if (!leader) {
    //   return res.status(404).json({ error: 'Leader not found' });
    // }

    // Generate a unique team code
    const teamCode = generateTeamCode();

    // Create a new team with the generated code
    const newTeam = new Team({
    //   leader: leader._id,
      teamName: teamName,
      domains: domains,
      teamCode: teamCode,
    });

    // Save the new team
    const savedTeam = await newTeam.save();

    res.json({ success: true, team: savedTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getTeamsController = async (req, res) => {
    try {
      const { email } = req.params;
      
  
      // Find the user by email
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const teams = await Team.find({ 'domains.members': email });
  
      res.json({ success: true, teams });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  
  
  
  

module.exports = {
    createTeamController,
    getTeamsController,
};



const User = require('../models/userModel.js');
const Team = require('../models/teamModel.js');
const sendEmail = require("../utils/email.js");



function generateTeamCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let teamCode = '';
    for (let i = 0; i < 6; i++) {
      teamCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return teamCode;
  }

const createTeamController = async (req, res) => {
    const { leaderEmail, teamName, domains } = req.body;

  try {
    // Validate that the leader exists
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) {
      return res.status(404).json({ error: 'Leader not found' });
    }

    // Generate a unique team code
    const teamCode = generateTeamCode();

    // Create a new team with the generated code
    const newTeam = new Team({
    
      leaderEmail:leaderEmail,
      teamName: teamName,
      domains: domains,
      teamCode: teamCode,
    });

   
    const savedTeam = await newTeam.save();

    res.json({ success: true, team: savedTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getTeamsController = async (req, res) => {
    try {
      const { email } = req.body;
      
  
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
  
  

const sendTeamcodeController = async (req, res) => {
    try {
      const { teamId,domainName } = req.params;
      const {  recipients } = req.body;
  
      // Find the team by ID
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      
      const teamCode = team.teamCode ;

      const subject = 'Team Invitation';
      const message = `You have been invited to join the team.\n\nTeam Code: ${teamCode}\nDomain: ${domainName}`;
  
      // Iterate over recipients and send an email to each
      for (const email of recipients) {
        await sendEmail({ email, subject, message });
      }
  
      res.json({ success: true, message: 'Emails sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  const joinTeamController = async (req, res) => {
    try {
      const { email,teamCode, domainName } = req.body;
      
  
      // Find the team with the provided team code and domain name
      const team = await Team.findOne({ teamCode, 'domains.name': domainName });
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      // Check if the user's email is already a member of the specified domain
      const isUserAlreadyMember = team.domains.some(domain => domain.members.includes(email));
      if (isUserAlreadyMember) {
        return res.status(400).json({ error: 'User is already a member of the specified domain' });
      }
  
      // Add the user's email to the specified domain
      const domainIndex = team.domains.findIndex(domain => domain.name === domainName);
      team.domains[domainIndex].members.push(email);
      await team.save();
  
      res.json({ success: true, message: 'User added to the team and domain successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
  
  

module.exports = {
    createTeamController,
    getTeamsController,
    sendTeamcodeController,
    joinTeamController,
};

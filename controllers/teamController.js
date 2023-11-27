require("dotenv").config()

const User = require('../models/userModel.js');
const Team = require('../models/teamModel.js');
const {send_team_code}=require("./mailController.js");
const jwt=require("jsonwebtoken");


function generateTeamCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let teamCode = '';
    for (let i = 0; i < 6; i++) {
      teamCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return teamCode;
  }

const createTeamController = async (req, res) => {
    const {  teamName, domains } = req.body;
  

  try {

    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(authorizationHeader,process.env.SECRET_KEY_JWT);
    
    const leaderEmail = decodedToken.email;

   
    const teamCode = generateTeamCode();

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
      const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(authorizationHeader,process.env.SECRET_KEY_JWT);
   
    const email = decodedToken.email;
    
      
  
      
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
   

      const teams = await Team.find({
        $or: [
          { 'domains.members': email }, 
          { leaderEmail: email }, 
        ],
      });
  
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

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'No recipients defined' });
      }
  
     
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      
      const teamCode = team.teamCode ;
      for(const email of recipients){
      send_team_code(email,teamCode,domainName);}

      return res.json({ success: true, message: 'Emails sent successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  const joinTeamController = async (req, res) => {
    try {
      const { teamCode, domainName } = req.body;
      const authorizationHeader = req.headers.authorization;
    console.log("token:",authorizationHeader);
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(authorizationHeader,process.env.SECRET_KEY_JWT);
    console.log("decodedtoken:",decodedToken);
    const email = decodedToken.email;
    console.log("email:",email);


      const team = await Team.findOne({ teamCode, 'domains.name': domainName });
      if (!team) {
        return res.status(404).json({ error: 'Team or domainName may be wrong' });
      }


      const isUserAlreadyMember = team.domains.some(domain => domain.members.includes(email));
      if (isUserAlreadyMember) {
        return res.status(400).json({ error: 'User is already a member of some domain' });
      }
  
      const domainIndex = team.domains.findIndex(domain => domain.name === domainName);
      team.domains[domainIndex].members.push(email);
      await team.save();
  
      res.json({ success: true, message: 'User added to the team and domain successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const getTeamByCodeController = async (req, res) => {
    try {
      const { teamCode } = req.params;
  
      
      const team = await Team.findOne({ teamCode });
  
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      res.json({ success: true, team });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



  const addTaskController = async (req, res) => {
    try {

      const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(authorizationHeader,process.env.SECRET_KEY_JWT);
    
    const leadEmail = decodedToken.email;
    

      const { teamCode } = req.params;
      const { domainName, email, task, deadline } = req.body;
  
      
      const team = await Team.findOne({ teamCode });
  
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      if (team.leaderEmail !== leadEmail) {
        return res.status(403).json({ error: 'Only the team leader is allowed to add tasks' });
      }
  
     
      const domain = team.domains.find((domain) => domain.name === domainName);
  
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found within the team' });
      }

      const isEmailInDomain = domain.members.includes(email);
      if (!isEmailInDomain) {
        return res.status(400).json({ error: 'Assigned email is not a member of the specified domain' });
      }

      const isTaskAssigned = domain.tasks.some(
        (taskObj) => taskObj.assignedTo === email && taskObj.description === task
      );
      if (isTaskAssigned) {
        return res.status(400).json({ error: 'Task already assigned to the specified email' });
      }
  
      domain.tasks.push({
        description: task,
        assignedTo: email,
        deadline: deadline,
        completed: false, 
      });
  
      
      await team.save();
  
      res.json({ success: true, message: 'Task added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  const taskCompletedController = async (req, res) => {
    try {

      const authorizationHeader = req.headers.authorization;
    
      if (!authorizationHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }
  
      const decodedToken = jwt.verify(authorizationHeader,process.env.SECRET_KEY_JWT);
      
      const leadEmail = decodedToken.email;

      const { teamCode, domainName, email, task } = req.body;
  
     
      const team = await Team.findOne({ teamCode });
  
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }


      if (team.leaderEmail !== leadEmail) {
        return res.status(403).json({ error: 'Only the team leader is allowed to mark tasks' });
      }
  
      
      const domain = team.domains.find((domain) => domain.name === domainName);
  
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found within the team' });
      }
  
     
      const taskToComplete = domain.tasks.find(
        (taskObj) => taskObj.assignedTo === email && taskObj.description === task
      );
  
      if (!taskToComplete) {
        return res.status(404).json({ error: 'Task not found for the specified email and description' });
      }
  
      taskToComplete.completed = true;
  
      await team.save();
  
      res.json({ success: true, message: 'Task marked as completed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const deleteMemberController=async(req,res)=>{
    try{
      const authorizationHeader=req.headers.authorization;

      if(!authorizationHeader){
        return res.status(401).json({error:"Authorization header missing"});
      }
      const decodedToken=jwt.verify(authorizationHeader,process.env.SECRET_KEY_JWT);

      const email=decodedToken.email;
      
      const { teamId} = req.params;
      

      const team=await Team.findOne({"_id":teamId});


      if(email===team.leaderEmail){
        const body=req.body;
        const newLeaderEmail=body.Email;
        if(!newLeaderEmail){
          return res.status(400).json("Please enter new leader's email");
        };
        const domainWithMember = team.domains.find((domain) => domain.members.includes(newLeaderEmail));

        if (!domainWithMember) {
          return res.status(400).json({ error: "New leader is not present in any domain" });
        }

        domainWithMember.members = domainWithMember.members.filter(member => member !== newLeaderEmail);

        team.leaderEmail = newLeaderEmail;
        await team.save();
        return res.status(200).json({ message: "New leader assigned" });
      }
      else{

        const domainWithMember = team.domains.find((domain) => domain.members.includes(emailToDelete));

        if (!domainWithMember) {
          return res.status(400).json({ error: "Email is not a member of any domain" });
        }

        domainWithMember.members = domainWithMember.members.filter(member => member !== emailToDelete);

        await team.save();

        return res.status(200).json({ message: "Member deleted successfully!" });
      }
    }catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = {
    createTeamController,
    getTeamsController,
    sendTeamcodeController,
    joinTeamController,
    getTeamByCodeController,
    addTaskController,
    taskCompletedController,
    deleteMemberController

}

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User schema
    // required: true
  },
  teamName: {
    type: String,
    required: true
  },
  domains: [
    {
      name: {
        type: String,
        required: true
      },
      members: [
        {
          type: String,
        }
      ]
    }
  ],
  teamCode: {
    type: String,
    unique: true,
    required: true
  },
  numberOfMembers: {
    type: Number,
    default: 0
  },
  
 
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// teamSchema.pre('save', async function (next) {
//   // Update the number of members before saving
//   this.numberOfMembers = this.members.length;

//   // Generate a unique team code if not provided
//   if (!this.teamCode) {
//     this.teamCode = generateTeamCode();
//   }

//   next();
// });


function generateTeamCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let teamCode = '';
  for (let i = 0; i < 6; i++) {
    teamCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return teamCode;
}

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

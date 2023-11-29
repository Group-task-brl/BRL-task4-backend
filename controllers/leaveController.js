/*require("dotenv").config()

const jwt=require("jsonwebtoken");

const ApplyleaveController=async(req,res)=>{

    try {
        const { teamId } = req.params;
        const authorizationHeader = req.headers.authorization;
    
        if (!authorizationHeader) {
          return res.status(401).json({ error: 'Authorization header missing' });
        }
    
        const decodedToken = jwt.verify(authorizationHeader, process.env.SECRET_KEY_JWT);
    
        const email = decodedToken.email;
    
}*/
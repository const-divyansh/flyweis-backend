import jwt from 'jsonwebtoken';
import {findById} from '../services/helper.js'

export const protect = async (req,res,next)=>{
    const SECRET = process.env.SECRET;
    let token;
    let decoded;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return res.status(403).send('A Token is required to Authentication');
        }
        try{
            decoded = jwt.verify(token,SECRET);
        }
       catch(err){
           if(err.name=='JsonWebTokenError')
              return  res.status(401).send("Invalid Token")
           else if(err.name=='TokenExpiredError')
              return res.status(401).send("Token Expired")
       }  

       //Check if User still exists
       let currentUser;
       try{
            currentUser = await findById(decoded);
       }catch{
           console.log(Error)
       }
       if(!currentUser)
         return res.status(404).send('User not available');

    req.user=currentUser 
    next();
}

export const restrictTo = (...roles) =>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).send('Sorry!! Only Admins are allowed to access this Route')
        }
        next();
    }
}
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { Users } from "../models/Users.js"
import { Token } from "../models/Token.js";
import { Ledger } from '../models/Ledger.js';

export const hashPassword = async (password)=>{
    const SALT = process.env.SALT_ROUNDS;
    try{
       return await bcrypt.hash(password,+SALT);
    }catch{
        console.log(Error('Error in Hash Password Method'))
    }
}

export const comparePassword = async (email,password) =>{
    try{
        let isTrue;
        const user = await findUserByEmail({email:email});
        if(user && await bcrypt.compare(password,user.password)){
            //console.log('Correct Password')
            isTrue=true;
        }else{
           // console.log("Wrong password");
            isTrue=false
        }
        return isTrue
    }
    catch{
        console.log(Error('Error in Compare Password Method'))
    }
}

export const signJWT=  ({_id,email,role})=>{
    const SECRET=process.env.SECRET;
    const EXPIRATION = process.env.EXPIRES_IN;
    const token = jwt.sign(
        {
            id:_id,
            email,
            role
        },
        SECRET,
        {
            expiresIn:EXPIRATION
        }
    )
    return token;
}

export const createResetPasswordToken = async({_id})=>{
    let plainToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(plainToken,+process.env.SALT_ROUNDS);
    const resetToken = await savePasswordResetToken(_id,hash);
    return {resetToken,plainToken,_id};
}

export const compareToken = async(plainToken,passwordResetToken)=>{
    return await bcrypt.compare(plainToken,passwordResetToken);
}

export const addUser= async ({email,password,mobile,role,routeHistory,ledgerList})=>{
    let newUser=null;
    try{
        const password_hash = await hashPassword(password);
         newUser = new Users({
            email:email,
            password:password_hash,
            mobile:mobile,
            role:role,
            routeHistory:routeHistory,
            ledgerList:ledgerList
        })
        await newUser.save();
        console.log("User is saved in DB");
        return newUser;
    }catch{
        console.log(Error("Error in Add Users Method"));
    }
}

export const findUserByEmail = async ({email})=>{
    try{
        return await Users.findOne({email});  
    }
    catch{
        console.log(Error)
    }
}

export const findById = async ({id})=>{
    try{
        return await Users.findById(id);
    }
    catch{
        console.log(Error)
    }
}
export const savePasswordResetToken = async(_id,hash)=>{
    let token;
    try{
        token = await new Token({
            userId: _id,
            token: hash,
            createdAt: Date.now(),
          }).save(); 
          console.log(`Password Token has been created`)
          return token;
    }catch{
        console.log(Error)
    }
}

export const deletePasswordResetToken = async({_id})=>{
    let token = await Token.findOne({ userId: _id });
    if (token) { 
          await Token.deleteOne({userId:_id})
    };
}

export const findToken =  async(userId)=>{
    let token = await Token.findOne({userId});
    return token;
}

export const saveNewPassword=async(newPassword,userId)=>{
    const newPasswordHash = await bcrypt.hash(newPassword,+process.env.SALT_ROUNDS);
    return await Users.findByIdAndUpdate(
        {
           _id:userId,
        },
        {
            $set:{
                password:newPasswordHash
            }
        },
        {
            new:true
        }
    );
}

export const addUserRoutes = async(id,routes)=>{
    return  await Users.findByIdAndUpdate(
        {
            _id:id
        },
        {
            $push:{
                routeHistory:{
                    $each:routes
                }
            }
        },
        {
            new:true
        }
    )
}

export const addUserLedgers = async(id,ledgers)=>{
    const ledger= await Ledger.findOneAndUpdate(
        {
            userId:id
        },
        {
            $push:{
                ledgerList:{
                    $each:ledgers
                }
            }
        },
        {
            new:true
        }
    );
    if(!ledger){
        return await new Ledger({
            userId:id,
            ledgerList:ledgers
        }).save();
    }
};

export const fetchAllLedgers=async (id)=>{
        const allLedgers = await Ledger.findOne({userId:id},{_id:0,userId:0,__v:0});
        if(allLedgers && Object.keys(allLedgers).length!=0){
            return allLedgers;
        }
        else{
            return false;
        }
}
// To DO : Temp Working Method
export const fetchAllRoutes = async(id)=>{
    const currentUser = await findById({id});
    return currentUser.routeHistory
}

export const fetchOneLedger=async(ledgerId,userId)=>{
    const ledgerList=await findById({userId});
    const ledger=null;
    if(ledgerList!=false){
         ledger = await find({_id:ledgerId})
    }

}
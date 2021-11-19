import { Users } from "../models/Users.js"
import { hashPassword } from './helper.js'
import { Token } from "../models/Token.js";
import bcrypt from 'bcrypt';

export const addUser= async ({email,password,mobile,role,routeHistory})=>{
    let newUser=null;
    try{
        const password_hash = await hashPassword(password);
         newUser = new Users({
            email:email,
            password:password_hash,
            mobile:mobile,
            role:role,
            routeHistory:routeHistory
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

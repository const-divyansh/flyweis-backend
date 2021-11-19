import bcrypt from 'bcrypt';
import { findUserByEmail, savePasswordResetToken } from './database_methods.js';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { Users } from '../models/Users.js';

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
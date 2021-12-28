import { addUser, deletePasswordResetToken, findToken, saveNewPassword,findUserByEmail } from "../services/helper.js";
import { comparePassword, compareToken, createResetPasswordToken } from '../services/helper.js';
import { signJWT } from "../services/helper.js";
import { sendEmail } from "../utils/email.js";


let jwtToken;

export const signup=async(req,res,next)=>{ 
    const ifUserExists=await findUserByEmail(req.body);
    if(ifUserExists){
        return res.send('User with particular Email-Id already exists');
    }
    const newUser = await addUser(req.body);
    jwtToken = signJWT(newUser);
    res.status(200).json({
        status:'Sucessful Sign Up',
        token:jwtToken,
        data:{
            user:newUser
        }
    })
}

export const login = async (req,res,next)=>{
    const {email,password}=req.body;
    const isCorrect = await comparePassword(email,password);
    if(isCorrect){
        const user = await findUserByEmail({email});
        jwtToken = signJWT(user);
        res.status(200).json({
            status:'Sucessfull Login',
            token:jwtToken,
            data:{
                user
            }
        })
    }else{
        res.status(400).send('Incorrect Email or Password');
    }
}

export const forgetPassword  = async(req,res,next)=>{
    //1. Find user based on Email
    const user = await findUserByEmail(req.body);
    if(!user)
        res.status(404).send('User not found');
    else
        deletePasswordResetToken(user);    
    //2. Generate Reset Token
    const {plainToken,_id:userId} = await createResetPasswordToken(user)

    const resetURL = `${process.env.CLIENT_URL}/reset?token=${plainToken}&id=${userId}`;
    const message =  `Forgot your Password? Submit a a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password , please ignore this email`
    try{
        await sendEmail({
            email:user.email,
            subject:'Your Password Reset Token',
            message
        });
       res.status(200).json({
            status:"Success",
            message:'Token sent to email!'
        });
    }catch(err){
        console.log(err)
        deletePasswordResetToken(user);
        return res.status(500).send('Some Internal Error has occured')
    }
}

export const resetPassword = async(req,res,next)=>{
    const userId=req.query.id;
    const plainToken=req.query.token;
    const newPassword=req.body.password;

    let passwordResetToken= await findToken(userId);

    if(!passwordResetToken){
       return res.send('Invalid or expired password reset token');
    }

    const isValid = compareToken(plainToken,passwordResetToken.token);
    if(!isValid){
       return res.send('Invalid or expired password reset token');
    }

    const updatedUserDetails=await saveNewPassword(newPassword,userId);

    res.status(200).json({
        status:"Password Updated Sucessfully",
        data:{
            updatedUserDetails
        }
    });
}
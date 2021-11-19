import { Users } from "./Users.js";
import { hashPassword } from '../services/helper.js'
import { signJWT } from "../services/helper.js";


export const SaveUser= async()=>{
     try{
        const hashedPassword = await hashPassword('emp_password_hash')
        const testEmp = new Users({
            email:'testEmp@gmail.com',
            password:hashedPassword,
            mobile:9650799031
        });
        await testEmp.save();
        const token = signJWT(testEmp);
        console.log("Test Emp is saved to the DB with token :" +token)
     }
     catch{
         console.log(Error);
     }

     try{
        const hashedPassword = await hashPassword('admin_password_hash')
        const testAdmin = new Users({
            email:'testAdmin@gmail.com',
            password:hashedPassword,
            mobile:9650799031,
            role:'admin'
        });
        await testAdmin.save();
        const token = signJWT(testAdmin);
        console.log("Test Admin is saved to the DB with token :" +token)
     }
    catch{
        console.log(Error)
    }
}


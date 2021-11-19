import  Mongoose  from 'mongoose';
import  dotenv from 'dotenv';
dotenv.config({
    path:'./config.env'
});
import { app } from './app.js';


const DB = process.env.DATABASE_LOCAL
const PORT = process.env.PORT

export const startApp = async()=>{
    try{
       await Mongoose.connect(DB,{
            useCreateIndex:true,
            useFindAndModify:false,
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
    }
    catch(err){
        console.log(err)
    }
    
    app.listen( PORT||800 ,()=>{
        console.log('Server is running');
    })
}

startApp();


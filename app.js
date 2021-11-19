import  express  from 'express';
import { SaveUser } from './models/TestUser.js';
import { forgetPassword, resetPassword, signup } from './controllers/auth.js'
import { login } from './controllers/auth.js'
import { protect } from './middleware/authMiddleware.js';
import { restrictTo } from './middleware/authMiddleware.js';


export const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/test-users',async (req,res,next)=>{
    try{
        await SaveUser();
        res.status(200).send('Success');
    }
    catch{
        console.log(Error)
    }
});

app.get('/signup',signup);

app.post('/login',login);

app.use('/profile',protect,(req,res)=>{
    res.send('Welcome to your Profile')
});

app.use('/admin-only',protect,restrictTo('admin'),(req,res)=>{
    res.send('You are able to view this page because of Admin Rights')
});

app.post('/forgot',protect,forgetPassword)
app.post('/reset',protect,resetPassword)


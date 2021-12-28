import  express  from 'express';
import { SaveUser } from './models/TestUser.js';
import { forgetPassword, resetPassword, signup } from './controllers/authController.js'
import { login } from './controllers/authController.js'
import { protect } from './middleware/authMiddleware.js';
import { restrictTo } from './middleware/authMiddleware.js';
import { addLedgers, addRoutes, showAllLedgers, showAllRoutes, showLedgerById} from './controllers/userController.js';


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

app.use('/add-routes',protect,addRoutes);

app.use('/add-ledger',protect,addLedgers);
app.use('/ledgers/:ledgerId',protect,showLedgerById)
app.use('/ledgers',protect,showAllLedgers);
app.use('/routes',protect,showAllRoutes);

app.post('/forgot',protect,forgetPassword)
app.patch('/reset',protect,resetPassword)


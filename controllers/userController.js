import { addUserLedgers, addUserRoutes, fetchAllLedgers, findById, fetchAllRoutes, fetchOneLedger } from "../services/helper.js";

//Assumig that User can add multiple routes at same time and send them

export const addRoutes = async(req,res,next)=>{
    const routeHistory = req.body.routeHistory;
    const currentUser = await addUserRoutes(req.user._id,routeHistory);
    res.status(200).json({
        message:"Success",
        data:currentUser
    })
}
export const showAllRoutes = async(req,res,next)=>{
    const currentUser=await findById(req.user);
    if(currentUser!=null){
        const routesList = await fetchAllRoutes(req.user._id);
        if(routesList)
            return res.status(200).send(routesList)
        else{
            return res.status(200).send('No Routes Added');    
        }
    }else{
        res.status(404).send('User not found ; Cannot retrive the Routes');
    }

}
//Assuming that User can add multiple Ledger at same time and send them

export const addLedgers = async(req,res,next)=>{
    const ledgerDetails = req.body.ledgerDetails;
    await addUserLedgers(req.user._id,ledgerDetails);
    const currentUser = await findById(req.user);
    res.status(200).json({
        message:"Success",
        data:currentUser
    })
}

export const showAllLedgers = async(req,res,next)=>{
    const currentUser=await findById(req.user);
    if(currentUser){
        const ledgerList = await fetchAllLedgers(req.user._id);
        if(ledgerList)
            return res.status(200).send(ledgerList)
        else{
            return res.status(200).send('Empty Ledger , Please add Ledgers');    
        }
    }else{
        res.status(404).send('User not found ; Cannot retrive the Ledgers');
    }
}

//Show Particular Ledger
export const showLedgerById = async(req,res,next)=>{
    const currentUser = await findById(req.user);
    if(currentUser){
        const ledger = await fetchOneLedger(req.params.ledgerId,currentUser._id);
    }else{
        console.log("Hi")
    }
}
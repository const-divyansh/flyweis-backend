import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ledgerSchema = new mongoose.Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            required: true,
            ref:"users"
        },
        ledgerList:[
            {
            ledger:{
                type:String,
            }
        }]
    }
);

export const Ledger = mongoose.model('Ledger',ledgerSchema);

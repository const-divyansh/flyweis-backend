import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        mobile:{
            type:Number
        },
        role:{
            type:String,
            default:"employee",
            enum:["employee","admin"]
        },
        passwordResetToken:{
            type:String,
            index:{
                expires:'5m'
            }
        },
        passwordResetOTP:{
            
        },
        passwordChangeAt:{
            type:Date
        },
        routeHistory:[
            {
                start:{
                    type:String
                },
                end:{
                    type:String
                },
                weeekday:{
                    type:String
                },
                date:{
                    type:Date
                }
            }
        ],
        attendanceLogs:[
            {
                type:String
            }
        ],
        shifts:[
            {
                type:String
            }
        ],
        holidays:[
            {
                type:Date
            }
        ]
        //To DO Invoice and Ledger
    }
)


export const Users = mongoose.model('users',userSchema)
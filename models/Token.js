import mongoose from 'mongoose';
import { Users } from './Users.js';
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index:{
      expires: 60,// this is the expiry time in seconds
    }
  },
});

tokenSchema.index({createdAt:1},{expireAfterSeconds:60})
export const Token = mongoose.model("Token", tokenSchema);

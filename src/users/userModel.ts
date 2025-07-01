import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/User.interface";

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true }
})

export const userModel = mongoose.model<IUser>("Users", userSchema);
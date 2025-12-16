import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/User.interface";
import bcrypt from "bcrypt";

export type { IUser };

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true }
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password as string, 10);
    }
    next();
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password as string);
}


interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

export const userModel = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>("Users", userSchema);
import { Schema } from "mongoose";
import { IUser, userModel } from "../users/userModel";

interface IAdmin extends IUser {
    adminLevel: number;
    logs: string[];
}

const adminSchema: Schema = new Schema({
    adminLevel: { type: Number, required: true },
    logs: [{ type: String, required: true }],
});

export const adminModel = userModel.discriminator<IAdmin>("Admin", adminSchema);
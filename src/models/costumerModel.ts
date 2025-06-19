import { Schema, Types } from "mongoose";
import { IUser, userModel } from "./userModel";

interface ICostomer extends IUser {
    orderHistory: Types.ObjectId[];
}

const costomerSchema: Schema = new Schema({
    orderHistory: [{ type: Types.ObjectId, required: true }],
})

export const costomerModel = userModel.discriminator<ICostomer>("Costomer", costomerSchema);
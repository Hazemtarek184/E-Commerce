import mongoose, { Schema, Types } from "mongoose";
import { IUser, userModel } from "../users/userModel";

interface ISeller extends IUser {
    productsId: Types.ObjectId[];
}

const sellerSchema: Schema = new Schema({
    productsId: [{ type: Types.ObjectId, required: true }],
})

export const sellerModel = userModel.discriminator<ISeller>("Seller", sellerSchema);
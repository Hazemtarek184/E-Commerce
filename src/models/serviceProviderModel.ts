import mongoose, { Schema } from "mongoose";
import { IServiceProvider } from "../types/service.provider.interface";

const serviceProviderSchema: Schema = new Schema({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    imageUrl: [{ type: String, required: true }],
    workingDays: [{ type: String, required: true }],
    workingHours: [{ type: String, required: true }],
    closingHours: [{ type: String, required: true }],
    phoneConstact: [{ type: Schema.Types.Mixed, required: true }],
    locationLinks: [{ type: String, required: true }],
    offers: [{ type: Schema.Types.Mixed, required: false }],
});

export const serviceProviderModel = mongoose.model<IServiceProvider>("Products", serviceProviderSchema);
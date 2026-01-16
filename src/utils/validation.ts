import { Types } from "mongoose";

// Utility for ObjectId validation
export const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};
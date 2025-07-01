import { userModel } from "./userModel";
import { signJwt, verifyJwt } from "../utils/jwt";

export async function loginUserService(phone: string, password: string) {
    if (!phone || !password) {
        throw new Error("Phone number and password are required.");
    }
    const user = await userModel.findOne({ phone });
    if (!user) {
        throw new Error("Invalid phone number.");
    }
    // For demonstration, compare plain text passwords (not secure for production)
    if (user.password !== password) {
        throw new Error("Invalid phone number or password.");
    }
    return user;
}

export async function addUserService({ username, email, password, phone, gender }: { username: string, email: string, password: string, phone: string, gender: string }) {
    if (!username || !email || !password || !phone || !gender) {
        throw new Error("All fields are required.");
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists with this email.");
    }
    const newUser = new userModel({ username, email, password, phone, gender });
    await newUser.save();
    return newUser;
}

export function checkUserTokenService(token: string) {
    if (!token) {
        throw new Error("No token provided.");
    }
    return verifyJwt(token);
}

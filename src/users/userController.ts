import { Request, Response } from "express";
import { addUserService, loginUserService, checkUserTokenService, getUsersService, getUserByIdService } from "./userService";
import { signJwt } from "../utils/jwt";

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, phone, gender } = req.body;
        const newUser = await addUserService({ username, email, password, phone, gender });
        const token = signJwt({ id: newUser._id, phone: newUser.phone });
        res.status(201).json({ message: "User created successfully.", user: newUser, token });
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to create user." });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, password } = req.body;
        const user = await loginUserService(phone, password);
        const token = signJwt({ id: user._id, phone: user.phone });
        res.status(200).json({ message: "Login successful.", user, token });
    } catch (error: any) {
        res.status(401).json({ message: error.message || "Invalid phone number or password." });
    }
};

export const checkUserToken = (req: Request, res: Response): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "No token provided." });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = checkUserTokenService(token);
        res.status(200).json({ valid: true, decoded });
    } catch (error: any) {
        res.status(401).json({ valid: false, message: error.message || "Invalid or expired token.", error });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsersService();
        res.status(200).json({ users });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to get users." });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to get user." });
    }
};
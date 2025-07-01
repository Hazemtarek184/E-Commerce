import jwt, { SignOptions } from "jsonwebtoken";

export function signJwt(
    payload: string | object | Buffer,
    options: SignOptions = { expiresIn: "1d" }
): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    return jwt.sign(payload, secret, options);
}

export function verifyJwt(token: string): any {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    return jwt.verify(token, secret);
} 
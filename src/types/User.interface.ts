export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
}
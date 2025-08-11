import { Document, Schema, model } from 'mongoose';

//Interface for users
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'customer';
    createdAt: Date;
}

//schema mongoose, defines fields, types, validations and indexes
const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        requires: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default model<IUser>('User', UserSchema);
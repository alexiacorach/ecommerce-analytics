import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        email: string;
    };
}

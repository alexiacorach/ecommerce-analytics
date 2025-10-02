"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
//Middleware to validate jwt token and add user to req
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Not authorized, no token' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role, email: '' };
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.protect = protect;
//middleware to authorize admin
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'admin')
        return res.status(403).json({ message: 'Admin role required' });
    next();
};
exports.isAdmin = isAdmin;

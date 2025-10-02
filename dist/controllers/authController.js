"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
//User register
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        //validate no user with same email
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        //hash password
        const salt = await bcryptjs_1.default.genSalt(10); // salt: random value for each password
        const hashedPassword = await bcryptjs_1.default.hash(password, salt); //hash: safe resuult loaded in database
        //create user
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });
        await user.save();
        //create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
//Login User
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //find user by email
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid email' });
        // Compare password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid password' });
        //create token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token, user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;

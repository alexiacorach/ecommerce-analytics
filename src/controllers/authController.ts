import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

//User register
export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        //validate no user with same email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        //hash password
        const salt = await bcrypt.genSalt(10); // salt: random value for each password
        const hashedPassword = await bcrypt.hash(password, salt); //hash: safe resuult loaded in database

        //create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer'
        })
        await user.save();

        //create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

//Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        //find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        //create token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}
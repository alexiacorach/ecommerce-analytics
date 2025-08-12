import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Product from "../models/Product";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB")

        //clean coleccions
        await User.deleteMany();
        await Product.deleteMany();

        //hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("12345", salt)

        //User Data
        const users = [
            { name: "Admin User", email: "admin@example.com", password: hashedPassword, role: "admin" },
            { name: "John Doe", email: "john@example.com", password: hashedPassword, role: "customer" },
            { name: "Jane Smith", email: "jane@example.com", password: hashedPassword, role: "customer" }
        ];

        const products = [
            { name: "Laptop Dell XPS", price: 1500, stock: 5, category: "Electronics" },
            { name: "Mouse Logitech", price: 30, stock: 20, category: "Electronics" },
            { name: "Keyboard Mechanical", price: 80, stock: 15, category: "Electronics" }
        ];

        await User.insertMany(users);
        await Product.insertMany(products);

        console.log("Seed data inserted successfully")
        mongoose.connection.close();
    } catch (error) {
        console.error(" Error seeding data:", error);
        mongoose.connection.close();
    }
}

seedData()